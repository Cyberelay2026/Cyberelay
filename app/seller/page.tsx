import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";
import {
  archiveListing,
  markListingSold,
  publishListing,
  reactivateExpiredListing,
  restoreArchivedListing,
} from "./listings/actions";
import styles from "./dashboard.module.css";

const listingStatuses = [
  ["active", "Active"],
  ["draft", "Draft"],
  ["sold", "Sold"],
  ["expired", "Expired"],
  ["archived", "Archived"],
] as const;

type ListingStatus = (typeof listingStatuses)[number][0];
type DatabaseRow = Record<string, unknown>;

function textValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function formatPrice(row: DatabaseRow) {
  const cents =
    typeof row.price_cents === "number"
      ? row.price_cents
      : Number(row.price_cents);
  if (!Number.isFinite(cents)) return "Price unavailable";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function formatDate(value: unknown) {
  if (typeof value !== "string") return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatLocation(row: DatabaseRow) {
  const location = textValue(row.location);
  if (location) return location;
  return [textValue(row.city), textValue(row.province)]
    .filter(Boolean)
    .join(", ") || "Location unavailable";
}

function normalizedStatus(value: unknown): ListingStatus | null {
  return listingStatuses.find(([status]) => status === value)?.[0] ?? null;
}

export default async function SellerPage({ searchParams }: { searchParams: Promise<{ created?: string; updated?: string; published?: string; sold?: string; archived?: string; restored?: string; reactivated?: string; error?: string }> }) {
  const query = await searchParams;
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;

  if (authError || !userId) redirect("/seller/login");

  const [{ data: profile }, { data: listingData, error: listingsError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("display_name")
        .eq("id", userId)
        .maybeSingle(),
      supabase
        .from("listings")
        .select("id,title,price_cents,status,created_at,updated_at,city,province")
        .eq("seller_id", userId)
        .order("updated_at", { ascending: false }),
    ]);

  const profileRow = (profile ?? {}) as DatabaseRow;
  const metadata = authData.claims.user_metadata;
  const metadataName =
    metadata && typeof metadata === "object" && "display_name" in metadata
      ? textValue(metadata.display_name)
      : null;
  const email = textValue(authData.claims.email);
  const displayName =
    textValue(profileRow.display_name) ?? metadataName ?? email ?? "Seller";
  const listings = listingsError ? [] : ((listingData ?? []) as DatabaseRow[]);
  const listingIds = listings.map((listing) => textValue(listing.id)).filter((id): id is string => Boolean(id));
  const { data: imageData } = listingIds.length
    ? await supabase
        .from("listing_images")
        .select("listing_id,storage_path,sort_order,is_primary")
        .in("listing_id", listingIds)
        .order("sort_order", { ascending: true })
    : { data: [] };
  const selectedImages = new Map<string, { storage_path: string; is_primary: boolean }>();
  for (const image of imageData ?? []) {
    const existing = selectedImages.get(image.listing_id);
    if (!existing || (!existing.is_primary && image.is_primary)) {
      selectedImages.set(image.listing_id, image);
    }
  }
  const selectedEntries = [...selectedImages.entries()];
  const { data: signedImages } = selectedEntries.length
    ? await supabase.storage
        .from("listing-images")
        .createSignedUrls(selectedEntries.map(([, image]) => image.storage_path), 3600)
    : { data: [] };
  const imageUrls = new Map(
    selectedEntries.flatMap(([listingId], index) => {
      const signedUrl = signedImages?.[index]?.signedUrl;
      return signedUrl ? [[listingId, signedUrl] as const] : [];
    }),
  );
  const counts = Object.fromEntries(
    listingStatuses.map(([status]) => [
      status,
      listings.filter((listing) => listing.status === status).length,
    ]),
  ) as Record<ListingStatus, number>;

  return (
    <main className={`section ${styles.dashboardPage}`}>
      <div className="container">
        <header className={styles.dashboardHeader}>
          <div>
            <span className="eyebrow">SELLER DASHBOARD</span>
            <h1>Welcome, {displayName}</h1>
            <p>Manage your Cyberelay computer listings from one place.</p>
          </div>
          <div className={styles.headerActions}>
            <Link className="button" href="/seller/listings/new">
              Add Computer
            </Link>
            <form action={logout}>
              <button className="button button-outline" type="submit">
                Log out
              </button>
            </form>
          </div>
        </header>

        {query.created === "1" && <div className={styles.successNotice} role="status">Draft saved successfully.</div>}
        {query.updated === "1" && <div className={styles.successNotice} role="status">Listing updated successfully.</div>}
        {query.published === "1" && <div className={styles.successNotice} role="status">Listing published successfully.</div>}
        {query.sold === "1" && <div className={styles.successNotice} role="status">Listing marked as sold.</div>}
        {query.archived === "1" && <div className={styles.successNotice} role="status">Listing archived.</div>}
        {query.restored === "1" && <div className={styles.successNotice} role="status">Listing restored as a private draft.</div>}
        {query.reactivated === "1" && <div className={styles.successNotice} role="status">Expired listing reactivated.</div>}
        {query.error && <div className={styles.dataNotice} role="alert">{query.error === "sold-price" ? "Enter a valid sold price." : "That listing action could not be completed."}</div>}

        <section aria-labelledby="listing-summary-heading">
          <div className={styles.sectionTitle}>
            <div>
              <h2 id="listing-summary-heading">Listing summary</h2>
              <p>A quick view of your current inventory.</p>
            </div>
          </div>
          <div className={styles.summaryGrid}>
            {listingStatuses.map(([status, label]) => (
              <article className={styles.summaryCard} key={status}>
                <span>{label}</span>
                <strong>{counts[status]}</strong>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="seller-listings-heading" className={styles.listingsSection}>
          <div className={styles.sectionTitle}>
            <div>
              <h2 id="seller-listings-heading">Your listings</h2>
              <p>Only listings connected to your seller account appear here.</p>
            </div>
          </div>

          {listingsError ? (
            <div className={styles.dataNotice} role="alert">
              We couldn&apos;t load your listings right now. Please refresh and try again.
            </div>
          ) : listings.length === 0 ? (
            <div className={styles.emptyDashboard}>
              <span className="eyebrow">NO LISTINGS YET</span>
              <h3>You haven&apos;t listed any computers yet.</h3>
              <p>
                Start with accurate specifications so buyers can understand your computer.
              </p>
              <Link className="button" href="/seller/listings/new">Add Computer</Link>
            </div>
          ) : (
            <div className={styles.listingGrid}>
              {listings.map((listing, index) => {
                const status = normalizedStatus(listing.status);
                const label =
                  listingStatuses.find(([value]) => value === status)?.[1] ??
                  "Unknown";

                return (
                  <article
                    className={styles.listingCard}
                    key={textValue(listing.id) ?? `listing-${index}`}
                  >
                    {textValue(listing.id) && imageUrls.get(textValue(listing.id)!) && (
                      <img className={styles.listingImage} src={imageUrls.get(textValue(listing.id)!)} alt="" />
                    )}
                    <div className={styles.listingTopline}>
                      <span className={`${styles.statusBadge} ${status ? styles[status] : ""}`}>
                        {label}
                      </span>
                      <strong>{formatPrice(listing)}</strong>
                    </div>
                    <h3>{textValue(listing.title) ?? "Untitled computer"}</h3>
                    <p className={styles.location}>{formatLocation(listing)}</p>
                    <dl className={styles.listingDates}>
                      <div>
                        <dt>Created</dt>
                        <dd>{formatDate(listing.created_at)}</dd>
                      </div>
                      <div>
                        <dt>Updated</dt>
                        <dd>{formatDate(listing.updated_at)}</dd>
                      </div>
                    </dl>
                    {textValue(listing.id) && (
                      <div className={styles.listingActions}>
                        {(status === "draft" || status === "active" || status === "expired") && (
                          <Link className="button button-outline" href={`/seller/listings/${textValue(listing.id)}/edit`}>Edit</Link>
                        )}
                        {status === "draft" && (
                          <form action={publishListing}>
                            <input name="listing_id" type="hidden" value={textValue(listing.id) ?? ""} />
                            <button className="button" type="submit">Publish</button>
                          </form>
                        )}
                        {status === "active" && (
                          <form action={markListingSold} className={styles.soldForm}>
                            <input name="listing_id" type="hidden" value={textValue(listing.id) ?? ""} />
                            <label>
                              <span>Sold price (CAD)</span>
                              <input name="sold_price" inputMode="decimal" required defaultValue={(Number(listing.price_cents) / 100).toFixed(2)} />
                            </label>
                            <button className="button" type="submit">Mark sold</button>
                          </form>
                        )}
                        {(status === "draft" || status === "active" || status === "expired") && (
                          <form action={archiveListing}>
                            <input name="listing_id" type="hidden" value={textValue(listing.id) ?? ""} />
                            <button className="button button-outline" type="submit">Archive</button>
                          </form>
                        )}
                        {status === "archived" && (
                          <form action={restoreArchivedListing}>
                            <input name="listing_id" type="hidden" value={textValue(listing.id) ?? ""} />
                            <button className="button button-outline" type="submit">Restore as draft</button>
                          </form>
                        )}
                        {status === "expired" && (
                          <form action={reactivateExpiredListing}>
                            <input name="listing_id" type="hidden" value={textValue(listing.id) ?? ""} />
                            <button className="button" type="submit">Reactivate</button>
                          </form>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
