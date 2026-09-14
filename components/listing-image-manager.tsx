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
const acceptedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 0.82;

async function optimizeAsWebp(file: File) {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("Image decoding failed"));
      element.src = objectUrl;
    });
    const scale = Math.min(1, MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is unavailable");
    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", WEBP_QUALITY),
    );
    if (!blob || blob.type !== "image/webp") throw new Error("WebP conversion failed");
    return new File([blob], "optimized.webp", {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  function toggleSelected(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelectedIds(new Set(images.map((image) => image.id)));
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  async function uploadImages(formData: FormData) {
    const files = formData.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
    if (!files.length) return setMessage("Choose at least one image.");
    if (images.length + files.length > MAX_IMAGES) return setMessage(`A listing can have up to ${MAX_IMAGES} images.`);
    const invalid = files.find((file) => !acceptedImageTypes.has(file.type) || file.size > MAX_BYTES);
    if (invalid) return setMessage("Use JPEG, PNG or WebP images no larger than 5 MB each.");

    setBusy(true);
    setMessage(undefined);
    const supabase = createClient();
    let nextOrder = images.reduce((max, image) => Math.max(max, image.sort_order), -1) + 1;

    for (const file of files) {
      let optimizedFile: File;
      try {
        optimizedFile = await optimizeAsWebp(file);
      } catch {
        setMessage("An image could not be optimized. Try a different image.");
        setBusy(false);
        router.refresh();
        return;
      }

      const path = `${sellerId}/${listingId}/${crypto.randomUUID()}.webp`;
      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(path, optimizedFile, { contentType: "image/webp", upsert: false });

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
    setMessage("Images optimized as WebP and uploaded successfully.");
    setBusy(false);
    router.refresh();
  }

  async function deleteSelectedImages() {
    const selected = images.filter((image) => selectedIds.has(image.id));
    if (!selected.length) return;
    if (!window.confirm(`Delete ${selected.length} selected image${selected.length === 1 ? "" : "s"} from this listing?`)) return;

    setBusy(true);
    setMessage(undefined);
    const supabase = createClient();
    const { error: storageError } = await supabase.storage
      .from("listing-images")
      .remove(selected.map((image) => image.storage_path));

    if (storageError) {
      setMessage("The selected images could not be deleted.");
      setBusy(false);
      return;
    }

    const { error } = await supabase
      .from("listing_images")
      .delete()
      .eq("listing_id", listingId)
      .in("id", selected.map((image) => image.id));

    if (error) {
      setMessage("The image files were deleted, but their records could not be removed.");
    } else {
      const deletedPrimary = selected.some((image) => image.is_primary);
      const replacement = deletedPrimary
        ? images.find((image) => !selectedIds.has(image.id))
        : undefined;
      if (replacement) {
        await supabase
          .from("listing_images")
          .update({ is_primary: true })
          .eq("id", replacement.id)
          .eq("listing_id", listingId);
      }
      setMessage(`${selected.length} image${selected.length === 1 ? "" : "s"} deleted.`);
    }

    clearSelection();
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
          <p>Upload up to eight JPEG, PNG or WebP images. Each file is resized to 1,600px maximum and converted to WebP before upload.</p>
        </div>
        <strong>{images.length}/{MAX_IMAGES}</strong>
      </div>

      {message && <div className={styles.message} role="status">{message}</div>}

      {images.length > 0 && (
        <>
          <div className={styles.selectionBar}>
            <div>
              <button type="button" disabled={busy || selectedIds.size === images.length} onClick={selectAll}>Select all</button>
              <button type="button" disabled={busy || selectedIds.size === 0} onClick={clearSelection}>Clear selection</button>
              <span>{selectedIds.size} selected</span>
            </div>
            <button className={styles.deleteSelected} type="button" disabled={busy || selectedIds.size === 0} onClick={deleteSelectedImages}>
              Delete selected{selectedIds.size ? ` (${selectedIds.size})` : ""}
            </button>
          </div>
          <div className={styles.grid}>
          {images.map((image, index) => (
            <article className={`${styles.card} ${selectedIds.has(image.id) ? styles.selected : ""}`} key={image.id}>
              <div className={styles.preview}>
                <img src={image.signed_url} alt={`Listing image ${index + 1}`} />
                <label className={styles.selector}>
                  <input type="checkbox" checked={selectedIds.has(image.id)} disabled={busy} onChange={() => toggleSelected(image.id)} />
                  <span>Select image {index + 1}</span>
                </label>
                {image.is_primary && <span className={styles.primaryBadge}>Primary</span>}
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
        </>
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
