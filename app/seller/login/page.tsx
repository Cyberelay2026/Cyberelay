import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { createClient } from "@/lib/supabase/server";
import { login } from "../actions";

export default async function SellerLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ confirmation?: string }>;
}) {
  const query = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims?.sub) redirect("/seller");

  return (
    <main className="section auth-page">
      <div className="container auth-shell">
        <div className="auth-card">
          <span className="eyebrow">SELLER ACCESS</span>
          <h1>Welcome back</h1>
          <p>Log in to access your protected Cyberelay seller area.</p>
          {query.confirmation === "failed" && (
            <p className="auth-message auth-error" role="alert">
              The confirmation link is invalid or has expired. Please try again.
            </p>
          )}
          <AuthForm mode="login" action={login} />
        </div>
      </div>
    </main>
  );
}
