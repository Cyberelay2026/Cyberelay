import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell a Computer",
  description: "Create a clear, structured used-computer listing on Cyberelay and connect buyers to your Facebook Marketplace listing.",
  alternates: { canonical: "/sell" },
};

export default function SellPage() {
  return <main className="section"><div className="container narrow"><div className="eyebrow">SELL ON CYBERELAY</div><h1>Put your computer in front of buyers searching by specs.</h1><p className="lead">Create a structured listing with photos, condition, price and the details buyers care about. Add your Facebook Marketplace URL so interested buyers can contact you through your existing listing.</p><div className="hero-actions"><a className="button" href="/seller/signup">Create seller account</a><a className="button button-outline" href="/seller/login">Seller login</a></div><div className="notice">Cyberelay does not process payments or shipping. You remain responsible for your Marketplace listing and transaction.</div></div></main>;
}
