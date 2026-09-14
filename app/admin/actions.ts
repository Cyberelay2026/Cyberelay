"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireApprovedAccount } from "@/lib/account-access";

export async function setAccountStatus(formData: FormData) {
  const targetUserId = String(formData.get("user_id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!targetUserId || !["approved", "suspended"].includes(status)) {
    redirect("/admin?error=invalid-action");
  }

  const { supabase } = await requireApprovedAccount(true);
  const { error } = await supabase.rpc("admin_set_account_status", {
    target_user_id: targetUserId,
    new_status: status,
  });
  if (error) redirect("/admin?error=account-update");

  revalidatePath("/admin");
  redirect(`/admin?updated=${status}`);
}
