import Link from "next/link";

export default async function SellerAccessPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const suspended = status === "suspended";
  return <main className="section"><div className="container auth-shell">
    <section className="auth-card">
      <span className="eyebrow">ACCOUNT ACCESS</span>
      <h1>{suspended ? "Account suspended" : "Approval pending"}</h1>
      <p>{suspended
        ? "This account cannot access seller tools. Contact Cyberelay if you believe this is an error."
        : "Your email is confirmed. A Cyberelay administrator must approve your account before you can create or manage listings."}</p>
      <Link className="button button-outline" href="/seller/login">Back to sign in</Link>
    </section>
  </div></main>;
}
