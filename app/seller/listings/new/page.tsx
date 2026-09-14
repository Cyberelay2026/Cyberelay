import Link from "next/link";
import { redirect } from "next/navigation";
import { ListingForm } from "@/components/listing-form";
import { createClient } from "@/lib/supabase/server";
import styles from "./new-listing.module.css";

export default async function NewListingPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) redirect("/seller/login");

  return <main className={`section ${styles.page}`}><div className="container">
    <Link className={styles.backLink} href="/seller">← Back to dashboard</Link>
    <header className={styles.heading}><span className="eyebrow">NEW COMPUTER</span><h1>Create a structured listing</h1><p>Enter accurate specifications now. Your listing will be saved privately as a draft.</p></header>
    <ListingForm />
  </div></main>;
}
