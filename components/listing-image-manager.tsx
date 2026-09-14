"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "@/app/seller/listings/[id]/edit/images.module.css";

export type ListingImage = {
  id: string;
  storage_path: string;
  sort_order: number;
  is_primary: boolean;
  signed_url: string;
};

const MAX_IMAGES = 8;
const MAX_BYTES = 5 * 1024 * 1024;
const imageTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function ListingImageManager({
  listingId,
  sellerId,
  images,
}: {
  listingId: string;
  sellerId: string;
  images: ListingImage[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>();

  async function uploadImages(formData: FormData) {
    const files = formData.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
    if (!files.length) return setMessage("Choose at least one image.");
    if (images.length + files.length > MAX_IMAGES) return setMessage(`A listing can have up to ${MAX_IMAGES} images.`);
    const invalid = files.find((file) => !imageTypes[file.type] || file.size > MAX_BYTES);
    if (invalid) return setMessage("Use JPEG, PNG or WebP images no larger than 5 MB each.");

    setBusy(true);
    setMessage(undefined);
    const supabase = createClient();
    let nextOrder = images.reduce((max, image) => Math.max(max, image.sort_order), -1) + 1;

    for (const file of files) {
      const path = `${sellerId}/${listingId}/${crypto.randomUUID()}.${imageTypes[file.type]}`;
      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadError) {
        setMessage("An image could not be uploaded. Please try again.");
        setBusy(false);
        router.refresh();
        return;
      }

      const { error: metadataError } = await supabase.from("listing_images").insert({
        listing_id: listingId,
        storage_path: path,
        sort_order: nextOrder,
        is_primary: images.length === 0 && nextOrder === 0,
      });

      if (metadataError) {
        await supabase.storage.from("listing-images").remove([path]);
        setMessage("The image could not be attached to this listing.");
        setBusy(false);
        router.refresh();
        return;
      }
      nextOrder += 1;
    }

    if (inputRef.current) inputRef.current.value = "";
    setMessage("Images uploaded successfully.");
    setBusy(false);
    router.refresh();
  }

  async function removeImage(image: ListingImage) {
    if (!window.confirm("Delete this image from the listing?")) return;
    setBusy(true);
    setMessage(undefined);
    const supabase = createClient();
    const { error: storageError } = await supabase.storage.from("listing-images").remove([image.storage_path]);
    if (storageError) {
      setMessage("The image could not be deleted.");
      setBusy(false);
      return;
    }

    const { error } = await supabase.from("listing_images").delete().eq("id", image.id).eq("listing_id", listingId);
    if (error) {
      setMessage("The image file was deleted, but its record could not be removed.");
    } else {
      const replacement = image.is_primary ? images.find((candidate) => candidate.id !== image.id) : undefined;
      if (replacement) {
        await supabase.from("listing_images").update({ is_primary: true }).eq("id", replacement.id).eq("listing_id", listingId);
      }
      setMessage("Image deleted.");
    }
    setBusy(false);
    router.refresh();
  }

  async function makePrimary(image: ListingImage) {
    setBusy(true);
    setMessage(undefined);
    const supabase = createClient();
    const { error: clearError } = await supabase.from("listing_images").update({ is_primary: false }).eq("listing_id", listingId);
    const { error: primaryError } = clearError
      ? { error: clearError }
      : await supabase.from("listing_images").update({ is_primary: true }).eq("id", image.id).eq("listing_id", listingId);

    setMessage(primaryError ? "The primary image could not be changed." : "Primary image updated.");
    setBusy(false);
    router.refresh();
  }

  async function moveImage(index: number, direction: -1 | 1) {
    const other = images[index + direction];
    const current = images[index];
    if (!other || !current) return;

    setBusy(true);
    setMessage(undefined);
    const supabase = createClient();
    const first = await supabase.from("listing_images").update({ sort_order: other.sort_order }).eq("id", current.id).eq("listing_id", listingId);
    const second = first.error
      ? { error: first.error }
      : await supabase.from("listing_images").update({ sort_order: current.sort_order }).eq("id", other.id).eq("listing_id", listingId);

    setMessage(second.error ? "The image order could not be changed." : "Image order updated.");
    setBusy(false);
    router.refresh();
  }

  return (
    <section className={styles.manager} aria-labelledby="listing-images-heading">
      <div className={styles.heading}>
        <div>
          <span className="eyebrow">LISTING IMAGES</span>
          <h2 id="listing-images-heading">Computer photos</h2>
          <p>Upload up to eight JPEG, PNG or WebP images. Maximum 5 MB each.</p>
        </div>
        <strong>{images.length}/{MAX_IMAGES}</strong>
      </div>

      {message && <div className={styles.message} role="status">{message}</div>}

      {images.length > 0 && (
        <div className={styles.grid}>
          {images.map((image, index) => (
            <article className={styles.card} key={image.id}>
              <div className={styles.preview}>
                <img src={image.signed_url} alt={`Listing image ${index + 1}`} />
                {image.is_primary && <span>Primary</span>}
              </div>
              <div className={styles.controls}>
                {!image.is_primary && <button type="button" disabled={busy} onClick={() => makePrimary(image)}>Make primary</button>}
                <button type="button" disabled={busy || index === 0} onClick={() => moveImage(index, -1)} aria-label="Move image earlier">↑</button>
                <button type="button" disabled={busy || index === images.length - 1} onClick={() => moveImage(index, 1)} aria-label="Move image later">↓</button>
                <button type="button" disabled={busy} onClick={() => removeImage(image)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}

      {images.length < MAX_IMAGES && (
        <form action={uploadImages} className={styles.uploadForm}>
          <label>
            <span>Choose images</span>
            <input ref={inputRef} name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy} />
          </label>
          <button className="button" type="submit" disabled={busy}>{busy ? "Uploading…" : "Upload images"}</button>
        </form>
      )}
    </section>
  );
}
