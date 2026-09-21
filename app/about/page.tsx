import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn how Cyberelay helps Calgary buyers find and compare used laptops and computers by specifications, condition and price.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <main className="section"><div className="container narrow"><div className="eyebrow">ABOUT CYBERELAY</div><h1>A clearer way to shop for used computers in Calgary.</h1><p className="lead">Cyberelay turns inconsistent used-computer ads into listings you can actually compare. Search by processor, RAM, storage, price and condition, then open the seller&apos;s Facebook Marketplace post to ask questions and arrange the purchase.</p><div className="notice">Cyberelay is a discovery and comparison service. Payments, pickup arrangements and transactions take place directly with the seller.</div></div></main>;
}
