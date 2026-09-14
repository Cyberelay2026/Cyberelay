"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  brands,
  conditions,
  cpuBrands,
  cpuFamilies,
  gpuBrands,
  gpuTypes,
  osFamilies,
  provinces,
  ramOptions,
  resolutions,
  screenSizes,
  storageOptions,
  storageTypes,
} from "@/lib/listing-options";
import { requireApprovedAccount } from "@/lib/account-access";

export type ListingActionState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

const allowed = <T extends readonly unknown[]>(values: T, value: unknown) =>
  values.some((item) => (Array.isArray(item) ? item[0] : item) === value);

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function optional(value: string) {
  return value || null;
}

function slugify(value: string) {
  const base = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72) || "computer";
  return `${base}-${randomUUID().slice(0, 8)}`;
}

function buildListingTitle(values: {
  brand: string;
  model: string;
  cpu_brand: string;
  cpu_family: string;
  cpu_model: string;
  ram_gb: string;
  storage_gb: string;
  storage_type: string;
  gpu_brand: string;
  gpu_model: string;
}) {
  const storageGb = Number(values.storage_gb);
  const storageCapacity =
    storageGb >= 1024 && storageGb % 1024 === 0
      ? `${storageGb / 1024}TB`
      : `${storageGb}GB`;
  const storageLabel =
    storageTypes.find(([value]) => value === values.storage_type)?.[1] ??
    values.storage_type;
  const gpu = [values.gpu_brand, values.gpu_model].filter(Boolean).join(" ");
  const cpu = values.cpu_brand === "Apple"
    ? `Apple ${values.cpu_family}`
    : `${values.cpu_brand} ${values.cpu_model}`;
  const specifications = [
    cpu,
    `${values.ram_gb}GB RAM`,
    `${storageCapacity} ${storageLabel}`,
    gpu,
  ].filter(Boolean);

  return `${values.brand} ${values.model} — ${specifications.join(", ")}`;
}

function priceToCents(value: string) {
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return null;
  const cents = Math.round(Number(value) * 100);
  return Number.isSafeInteger(cents) && cents > 0 && cents <= 100_000_000
    ? cents
    : null;
}

function facebookMarketplaceUrl(value: string) {
  try {
    const url = new URL(value);
    const isFacebook =
      url.hostname === "facebook.com" || url.hostname.endsWith(".facebook.com");
    return url.protocol === "https:" && isFacebook && url.pathname.includes("/marketplace/");
  } catch {
    return false;
  }
}

export async function createListing(
  _previousState: ListingActionState,
  formData: FormData,
): Promise<ListingActionState> {
  const listingId = field(formData, "listing_id");
  const values = {
    brand: field(formData, "brand"),
    model: field(formData, "model"), cpu_brand: field(formData, "cpu_brand"),
    cpu_family: field(formData, "cpu_family"), cpu_model: field(formData, "cpu_model"),
    ram_gb: field(formData, "ram_gb"), storage_gb: field(formData, "storage_gb"),
    storage_type: field(formData, "storage_type"), gpu_type: field(formData, "gpu_type"),
    gpu_brand: field(formData, "gpu_brand"), gpu_model: field(formData, "gpu_model"),
    screen_size_inches: field(formData, "screen_size_inches"),
    resolution: field(formData, "resolution"), os_family: field(formData, "os_family"),
    os_version: field(formData, "os_version"), os_edition: field(formData, "os_edition"),
    condition: field(formData, "condition"),
    battery_health_percent: field(formData, "battery_health_percent"),
    price: field(formData, "price"), city: field(formData, "city"),
    province: field(formData, "province"),
    facebook_marketplace_url: field(formData, "facebook_marketplace_url"),
    description: field(formData, "description"),
    cosmetic_notes: field(formData, "cosmetic_notes"),
  };
  const errors: Record<string, string> = {};

  if (!allowed(brands, values.brand)) errors.brand = "Choose a supported brand.";
  if (!values.model || values.model.length > 100) errors.model = "Enter a model up to 100 characters.";
  if (!allowed(cpuBrands, values.cpu_brand)) errors.cpu_brand = "Choose a CPU brand.";
  const familyValues = cpuFamilies[values.cpu_brand as keyof typeof cpuFamilies] ?? [];
  if (!familyValues.some((value) => value === values.cpu_family)) errors.cpu_family = "Choose a matching CPU family.";
  if (values.cpu_brand !== "Apple" && (!values.cpu_model || values.cpu_model.length > 100)) errors.cpu_model = "Enter a CPU model up to 100 characters.";
  if (values.cpu_brand === "Apple" && values.cpu_model) errors.cpu_model = "Apple chip model is selected using CPU family.";

  if (!allowed(ramOptions, Number(values.ram_gb))) errors.ram_gb = "Choose a supported RAM amount.";
  if (!allowed(storageOptions, Number(values.storage_gb))) errors.storage_gb = "Choose a supported storage amount.";
  if (!allowed(storageTypes, values.storage_type)) errors.storage_type = "Choose a storage type.";
  if (!allowed(gpuTypes, values.gpu_type)) errors.gpu_type = "Choose a GPU type.";
  if (values.gpu_brand && !allowed(gpuBrands, values.gpu_brand)) errors.gpu_brand = "Choose a GPU brand.";
  if (values.gpu_type === "dedicated" && (!values.gpu_brand || !values.gpu_model)) errors.gpu_model = "Dedicated graphics require a brand and model.";
  if (values.gpu_model.length > 100) errors.gpu_model = "Use no more than 100 characters.";
  if (values.screen_size_inches && !allowed(screenSizes, Number(values.screen_size_inches))) errors.screen_size_inches = "Choose a screen size.";
  if (values.resolution && !allowed(resolutions, values.resolution)) errors.resolution = "Choose a resolution.";
  if (values.os_family && !allowed(osFamilies, values.os_family)) errors.os_family = "Choose an operating system.";
  if (values.os_version.length > 60 || values.os_edition.length > 60) errors.os_version = "Keep OS details under 60 characters.";
  if (!allowed(conditions, values.condition)) errors.condition = "Choose a condition.";
  const battery = values.battery_health_percent ? Number(values.battery_health_percent) : null;
  if (battery !== null && (!Number.isInteger(battery) || battery < 0 || battery > 100)) errors.battery_health_percent = "Use a whole number from 0 to 100.";
  const priceCents = priceToCents(values.price);
  if (priceCents === null) errors.price = "Enter a positive CAD price with no more than two decimals.";
  if (!values.city || values.city.length > 80) errors.city = "Enter a city up to 80 characters.";
  if (!allowed(provinces, values.province)) errors.province = "Choose a province or territory.";
  if (!facebookMarketplaceUrl(values.facebook_marketplace_url)) errors.facebook_marketplace_url = "Enter a valid HTTPS Facebook Marketplace URL.";
  if (values.description.length > 5000) errors.description = "Use no more than 5,000 characters.";
  if (values.cosmetic_notes.length > 2000) errors.cosmetic_notes = "Use no more than 2,000 characters.";

  if (Object.keys(errors).length > 0) {
    return { error: "Review the highlighted information and try again.", fieldErrors: errors };
  }

  const { supabase, userId: sellerId } = await requireApprovedAccount();

  const [resolutionWidth, resolutionHeight] = values.resolution
    ? values.resolution.split("x").map(Number)
    : [null, null];
  const title = buildListingTitle(values);
  const listingValues = {
    title,
    brand: values.brand,
    model: values.model,
    cpu_brand: values.cpu_brand,
    cpu_family: values.cpu_family,
    cpu_model: values.cpu_brand === "Apple" ? values.cpu_family : values.cpu_model,
    ram_gb: Number(values.ram_gb),
    storage_gb: Number(values.storage_gb),
    storage_type: values.storage_type,
    gpu_type: values.gpu_type,
    gpu_brand: optional(values.gpu_brand),
    gpu_model: optional(values.gpu_model),
    screen_size_inches: values.screen_size_inches ? Number(values.screen_size_inches) : null,
    resolution_width: resolutionWidth,
    resolution_height: resolutionHeight,
    os_family: optional(values.os_family),
    os_version: optional(values.os_version),
    os_edition: optional(values.os_edition),
    condition: values.condition,
    battery_health_percent: battery,
    description: optional(values.description),
    cosmetic_notes: optional(values.cosmetic_notes),
    price_cents: priceCents,
    city: values.city,
    province: values.province,
    facebook_marketplace_url: values.facebook_marketplace_url,
  };

  if (listingId) {
    const { data, error } = await supabase
      .from("listings")
      .update(listingValues)
      .eq("id", listingId)
      .eq("seller_id", sellerId)
      .in("status", ["draft", "active", "expired"])
      .select("id")
      .maybeSingle();

    if (error || !data) return { error: "We couldn't update this listing. It may no longer be editable." };
    revalidatePath("/seller");
    redirect("/seller?updated=1");
  }

  const { error } = await supabase.from("listings").insert({
    ...listingValues,
    seller_id: sellerId,
    slug: slugify(title),
    original_price_cents: priceCents,
    status: "draft",
  });

  if (error) return { error: "We couldn't save this draft. Please review the details and try again." };
  revalidatePath("/seller");
  redirect("/seller?created=1");
}
