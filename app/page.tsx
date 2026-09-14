import Link from "next/link";
import { Search, ShieldCheck, SlidersHorizontal, ExternalLink } from "lucide-react";
import { ComputerCard } from "@/components/computer-card";
import { getPublicComputers } from "@/lib/public-listings";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { computers } = await getPublicComputers();
  const featured = computers.slice(0, 3);
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">USED COMPUTERS · CALGARY</div>
            <h1>Find the right used computer, without the guesswork.</h1>
            <p className="hero-copy">Clear specifications, honest condition details and straightforward pricing — with direct links to Marketplace.</p>
            <div className="hero-actions">
              <Link className="button" href="/computers">Browse computers</Link>
              <Link className="button button-outline" href="/sell">Sell a computer</Link>
            </div>
          </div>
          <div className="hero-panel">
            <Search size={32} />
            <h2>Built for better used-PC shopping</h2>
            <p>Compare the specs that actually matter instead of scrolling through inconsistent listings.</p>
            <div className="mini-stats">
              <div><strong>{computers.length}</strong><span>Available now</span></div>
              <div><strong>100%</strong><span>Specs disclosed</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div><div className="eyebrow">AVAILABLE NOW</div><h2>Current laptops</h2></div>
            <Link href="/computers">View all →</Link>
          </div>
          <div className="card-grid">
            {featured.length ? featured.map((computer) => <ComputerCard computer={computer} key={computer.id} />) : (
              <div className="empty-state"><h3>No computers available yet</h3><p>Check back soon for newly published listings.</p></div>
            )}
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container feature-grid">
          <div className="feature"><SlidersHorizontal /><h3>Useful filters</h3><p>Find computers by brand, RAM, storage, price and condition.</p></div>
          <div className="feature"><ShieldCheck /><h3>Clear condition</h3><p>Condition, battery health and important notes are shown before you click through.</p></div>
          <div className="feature"><ExternalLink /><h3>Direct Marketplace link</h3><p>Found the right computer? Continue to its Facebook Marketplace listing.</p></div>
        </div>
      </section>

      <section className="section">
        <div className="container sell-banner">
          <div><div className="eyebrow">SELLING A COMPUTER?</div><h2>List it on Cyberelay.</h2><p>Structured listings help buyers understand exactly what you are selling.</p></div>
          <Link className="button" href="/sell">Sell on Cyberelay</Link>
        </div>
      </section>
    </main>
  );
}
