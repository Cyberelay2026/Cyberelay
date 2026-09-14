"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireApprovedAccount } from "@/lib/account-access";

async function authenticatedSeller() {
  const { supabase, userId: sellerId } = await requireApprovedAccount();
  return { supabase, sellerId };
}

function listingId(formData: FormData) {
  const value = formData.get("listing_id");
  return typeof value === "string" ? value.trim() : "";
}

export async function publishListing(formData: FormData) {
  const id = listingId(formData);
  if (!id) redirect("/seller?error=listing-action");

  const { supabase, sellerId } = await authenticatedSeller();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("listings")
    .update({
      status: "active",
      published_at: now,
      availability_confirmed_at: now,
    })
    .eq("id", id)
    .eq("seller_id", sellerId)
    .eq("status", "draft")
    .select("id")
    .maybeSingle();

  if (error || !data) redirect("/seller?error=listing-action");
  revalidatePath("/seller");
  redirect("/seller?published=1");
}

export async function markListingSold(formData: FormData) {
  const id = listingId(formData);
  const rawPrice = formData.get("sold_price");
  const price = typeof rawPrice === "string" ? rawPrice.trim() : "";
  if (!id || !/^\d+(\.\d{1,2})?$/.test(price)) {
    redirect("/seller?error=sold-price");
  }

  const soldPriceCents = Math.round(Number(price) * 100);
  if (!Number.isSafeInteger(soldPriceCents) || soldPriceCents <= 0 || soldPriceCents > 100_000_000) {
    redirect("/seller?error=sold-price");
  }

  const { supabase, sellerId } = await authenticatedSeller();
  const { data, error } = await supabase
    .from("listings")
    .update({
      status: "sold",
      sold_at: new Date().toISOString(),
      sold_price_cents: soldPriceCents,
    })
    .eq("id", id)
    .eq("seller_id", sellerId)
    .eq("status", "active")
    .select("id")
    .maybeSingle();

  if (error || !data) redirect("/seller?error=listing-action");
  revalidatePath("/seller");
  redirect("/seller?sold=1");
}

export async function archiveListing(formData: FormData) {
  const id = listingId(formData);
  if (!id) redirect("/seller?error=listing-action");

  const { supabase, sellerId } = await authenticatedSeller();
  const { data, error } = await supabase
    .from("listings")
    .update({ status: "archived" })
    .eq("id", id)
    .eq("seller_id", sellerId)
    .in("status", ["draft", "active", "expired"])
    .select("id")
    .maybeSingle();

  if (error || !data) redirect("/seller?error=listing-action");
  revalidatePath("/seller");
  redirect("/seller?archived=1");
}

export async function restoreArchivedListing(formData: FormData) {
  const id = listingId(formData);
  if (!id) redirect("/seller?error=listing-action");

  const { supabase, sellerId } = await authenticatedSeller();
  const { data, error } = await supabase
    .from("listings")
    .update({
      status: "draft",
      published_at: null,
      availability_confirmed_at: null,
    })
    .eq("id", id)
    .eq("seller_id", sellerId)
    .eq("status", "archived")
    .select("id")
    .maybeSingle();

  if (error || !data) redirect("/seller?error=listing-action");
  revalidatePath("/seller");
  redirect("/seller?restored=1");
}

export async function reactivateExpiredListing(formData: FormData) {
  const id = listingId(formData);
  if (!id) redirect("/seller?error=listing-action");

  const { supabase, sellerId } = await authenticatedSeller();
  const { data, error } = await supabase
    .from("listings")
    .update({
      status: "active",
      availability_confirmed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("seller_id", sellerId)
    .eq("status", "expired")
    .select("id")
    .maybeSingle();

  if (error || !data) redirect("/seller?error=listing-action");
  revalidatePath("/seller");
  redirect("/seller?reactivated=1");
}
