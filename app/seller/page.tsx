import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";
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
  const value =
    row.current_asking_price ?? row.current_price ?? row.asking_price ?? row.price;
  const price = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(price)) return "Price unavailable";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
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

export default async function SellerPage() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;

  if (authError || !userId) redirect("/seller/login");

  const [{ data: profile }, { data: listingData, error: listingsError }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase
        .from("listings")
        .select("*")
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
            <span
              aria-disabled="true"
              className={`${styles.disabledCta} button`}
              title="Listing creation is coming in the next milestone"
            >
              Add Computer
            </span>
            <form action={logout}>
              <button className="button button-outline" type="submit">
                Log out
              </button>
            </form>
          </div>
        </header>

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
                Structured listing creation will be available in the next milestone.
              </p>
              <span aria-disabled="true" className={styles.emptyCta}>
                Add Computer — coming soon
              </span>
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
