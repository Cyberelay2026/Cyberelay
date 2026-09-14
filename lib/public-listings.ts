import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { PublicComputer } from "@/lib/computer";

const listingSelect = "id,slug,brand,model,cpu_brand,cpu_family,cpu_model,ram_gb,storage_gb,storage_type,gpu_type,gpu_brand,gpu_model,screen_size_inches,resolution_width,resolution_height,os_family,os_version,os_edition,condition,battery_health_percent,description,cosmetic_notes,price_cents,city,province,facebook_marketplace_url,published_at";

type ListingRow = {
  id: string; slug: string; brand: string; model: string;
  cpu_brand: string; cpu_family: string | null; cpu_model: string;
  ram_gb: number; storage_gb: number; storage_type: string;
  gpu_type: string; gpu_brand: string | null; gpu_model: string | null;
  screen_size_inches: number | null; resolution_width: number | null; resolution_height: number | null;
  os_family: string | null; os_version: string | null; os_edition: string | null;
  condition: string; battery_health_percent: number | null;
  description: string | null; cosmetic_notes: string | null;
  price_cents: number; city: string; province: string;
  facebook_marketplace_url: string; published_at: string | null;
};

type ImageRow = {
  id: string;
  listing_id: string;
  storage_path: string;
  sort_order: number;
  is_primary: boolean;
};

const siteUrl = "https://www.cyberelay.ca";

function activeImageUrl(imageId: string) {
  return `${siteUrl}/images/listings/${imageId}`;
}

const conditionLabels: Record<string, string> = {
  new: "New", like_new: "Like New", excellent: "Excellent",
  good: "Good", fair: "Fair", poor: "Poor",
};

const storageLabels: Record<string, string> = {
  hdd: "HDD", sata_ssd: "SATA SSD", nvme_ssd: "NVMe SSD",
  emmc: "eMMC", other: "Other",
};

function mapComputer(row: ListingRow, images: string[]): PublicComputer {
  const cpu = row.cpu_brand === "Apple"
    ? `Apple ${row.cpu_family ?? row.cpu_model}`
    : [row.cpu_brand, row.cpu_family, row.cpu_model].filter(Boolean).join(" ");
  const gpu = [row.gpu_brand, row.gpu_model].filter(Boolean).join(" ")
    || (row.gpu_type === "integrated" ? "Integrated graphics" : "Graphics not specified");
  const resolution = row.resolution_width && row.resolution_height
    ? `${row.resolution_width} × ${row.resolution_height}`
    : "";
  const display = [
    row.screen_size_inches ? `${row.screen_size_inches}"` : "",
    resolution,
  ].filter(Boolean).join(" · ") || "Display not specified";
  const os = [row.os_family, row.os_version, row.os_edition].filter(Boolean).join(" ") || "Not specified";

  return {
    id: row.id,
    slug: row.slug,
    brand: row.brand,
    model: row.model,
    cpu,
    ram: row.ram_gb,
    storage: row.storage_gb,
    storageType: storageLabels[row.storage_type] ?? row.storage_type,
    gpu,
    display,
    os,
    condition: conditionLabels[row.condition] ?? row.condition,
    batteryHealth: row.battery_health_percent,
    price: row.price_cents / 100,
    city: row.city,
    province: row.province,
    description: row.description ?? "Contact the seller for additional details.",
    cosmeticNotes: row.cosmetic_notes ?? "",
    marketplaceUrl: row.facebook_marketplace_url,
    image: images[0] ?? "/laptop-placeholder.svg",
    images,
  };
}

async function attachImages(
  supabase: Awaited<ReturnType<typeof createClient>>,
  rows: ListingRow[],
) {
  if (!rows.length) return [];
  const ids = rows.map((row) => row.id);
  const { data } = await supabase
    .from("listing_images")
    .select("id,listing_id,storage_path,sort_order,is_primary")
    .in("listing_id", ids)
    .order("sort_order", { ascending: true });
  const imageRows = (data ?? []) as ImageRow[];
  const imagesByListing = new Map<string, Array<{ url: string; primary: boolean; order: number }>>();
  imageRows.forEach((image) => {
    const url = activeImageUrl(image.id);
    const list = imagesByListing.get(image.listing_id) ?? [];
    list.push({ url, primary: image.is_primary, order: image.sort_order });
    imagesByListing.set(image.listing_id, list);
  });

  return rows.map((row) => {
    const images = (imagesByListing.get(row.id) ?? [])
      .sort((a, b) => Number(b.primary) - Number(a.primary) || a.order - b.order)
      .map((image) => image.url);
    return mapComputer(row, images);
  });
}

export async function getPublicComputers(limit?: number) {
  const supabase = await createClient();
  let query = supabase
    .from("listings")
    .select(listingSelect)
    .eq("status", "active")
    .order("published_at", { ascending: false, nullsFirst: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) return { computers: [] as PublicComputer[], error: true };
  return { computers: await attachImages(supabase, (data ?? []) as ListingRow[]), error: false };
}

export const getPublicComputer = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(listingSelect)
    .eq("status", "active")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  const computers = await attachImages(supabase, [data as ListingRow]);
  return computers[0] ?? null;
});

export async function getPublicListingSlugs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("slug,updated_at")
    .eq("status", "active")
    .order("updated_at", { ascending: false });
  if (error) return [];
  return (data ?? []).map((row) => ({
    slug: String(row.slug),
    updatedAt: new Date(String(row.updated_at)),
  }));
}
