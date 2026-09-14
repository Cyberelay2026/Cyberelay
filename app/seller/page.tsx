import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";

export default async function SellerPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) redirect("/seller/login");

  const metadata = data.claims.user_metadata;
  const displayName =
    metadata && typeof metadata === "object" && "display_name" in metadata
      ? String(metadata.display_name)
      : "Seller";

  return (
    <main className="section">
      <div className="container narrow">
        <span className="eyebrow">SELLER AREA</span>
        <h1>Hello, {displayName}</h1>
        <p className="lead">
          You are securely signed in. The seller dashboard and listing tools
          will be added in the next milestone.
        </p>
        <div className="seller-placeholder">
          <div>
            <strong>Authentication active</strong>
            <p>Your seller account session has been verified on the server.</p>
          </div>
          <form action={logout}>
            <button className="button button-outline" type="submit">
              Log out
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
