import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn how Cyberelay makes used computers easier to find and compare through structured specifications.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <main className="section"><div className="container narrow"><div className="eyebrow">ABOUT CYBERELAY</div><h1>Used computers, made easier to understand.</h1><p className="lead">Cyberelay organizes used-computer listings around clear technical specifications, condition information and price, then connects interested buyers to the seller's Marketplace listing.</p></div></main>;
}
