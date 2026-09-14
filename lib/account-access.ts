import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireApprovedAccount(adminOnly = false) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || !userId) redirect("/seller/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name,role,account_status")
    .eq("user_id", userId)
    .maybeSingle();

  if (!profile || profile.account_status !== "approved") {
    redirect(`/seller/access?status=${profile?.account_status ?? "pending"}`);
  }
  if (adminOnly && profile.role !== "admin") redirect("/seller");

  return { supabase, userId, profile, claims: data.claims };
}
