import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ListingForm } from "@/components/listing-form";
import { ListingImageManager, type ListingImage } from "@/components/listing-image-manager";
import { createClient } from "@/lib/supabase/server";
import styles from "../../new/new-listing.module.css";

const editableStatuses = ["draft", "active", "expired"];

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  const sellerId = authData?.claims?.sub;
  if (authError || !sellerId) redirect("/seller/login");

  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .eq("seller_id", sellerId)
    .maybeSingle();

  if (error || !listing || !editableStatuses.includes(String(listing.status))) notFound();

  const { data: imageRows } = await supabase
    .from("listing_images")
    .select("id,storage_path,sort_order,is_primary")
    .eq("listing_id", id)
    .order("sort_order", { ascending: true });
  const paths = (imageRows ?? []).map((image) => image.storage_path);
  const { data: signedRows } = paths.length
    ? await supabase.storage.from("listing-images").createSignedUrls(paths, 3600)
    : { data: [] };
  const images: ListingImage[] = (imageRows ?? []).flatMap((image, index) => {
    const signedUrl = signedRows?.[index]?.signedUrl;
    return signedUrl ? [{ ...image, signed_url: signedUrl }] : [];
  });

  const resolution =
    listing.resolution_width && listing.resolution_height
      ? `${listing.resolution_width}x${listing.resolution_height}`
      : "";
  const initialValues = {
    ...listing,
    price: typeof listing.price_cents === "number" ? (listing.price_cents / 100).toFixed(2) : "",
    resolution,
  };

  return <main className={`section ${styles.page}`}><div className="container">
    <Link className={styles.backLink} href="/seller">← Back to dashboard</Link>
    <header className={styles.heading}><span className="eyebrow">EDIT COMPUTER</span><h1>Edit structured listing</h1><p>Update the specifications below. Saving will keep the listing&apos;s current status.</p></header>
    <ListingImageManager listingId={id} sellerId={sellerId} images={images} />
    <ListingForm listingId={id} initialValues={initialValues} />
  </div></main>;
}
