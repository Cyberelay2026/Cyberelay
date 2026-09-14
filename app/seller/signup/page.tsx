import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { createClient } from "@/lib/supabase/server";
import { signup } from "../actions";

export default async function SellerSignupPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims?.sub) redirect("/seller");

  return (
    <main className="section auth-page">
      <div className="container auth-shell">
        <div className="auth-card">
          <span className="eyebrow">BECOME A SELLER</span>
          <h1>Create your account</h1>
          <p>Set up secure seller access. Listing tools will be added next.</p>
          <AuthForm mode="signup" action={signup} />
        </div>
      </div>
    </main>
  );
}
