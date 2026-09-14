import Link from "next/link";
import { ListingForm } from "@/components/listing-form";
import { requireApprovedAccount } from "@/lib/account-access";
import styles from "./new-listing.module.css";

export default async function NewListingPage() {
  await requireApprovedAccount();

  return <main className={`section ${styles.page}`}><div className="container">
    <Link className={styles.backLink} href="/seller">← Back to dashboard</Link>
    <header className={styles.heading}><span className="eyebrow">NEW COMPUTER</span><h1>Create a structured listing</h1><p>Enter accurate specifications now. Your listing will be saved privately as a draft.</p></header>
    <ListingForm />
  </div></main>;
}
