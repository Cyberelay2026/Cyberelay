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
            <div className="eyebrow">USED LAPTOPS &amp; COMPUTERS · CALGARY</div>
            <h1>Find a used laptop that fits your needs and budget.</h1>
            <p className="hero-copy">Compare used computers for work, school and everyday use by price, processor, RAM, storage and condition—then contact the seller on Facebook Marketplace.</p>
            <div className="hero-actions">
              <Link className="button" href="/computers">Browse used laptops</Link>
              <Link className="button button-outline" href="/sell">List your computer</Link>
            </div>
          </div>
          <div className="hero-panel">
            <Search size={32} />
            <h2>Shop with the important details upfront</h2>
            <p>See the specs, condition, battery health, location and asking price in one consistent format.</p>
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
            <div><div className="eyebrow">USED COMPUTERS IN CALGARY</div><h2>Available now</h2></div>
            <Link href="/computers">View all computers →</Link>
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
          <div className="feature"><SlidersHorizontal /><h3>Search by real specifications</h3><p>Filter available computers by brand, processor, RAM, storage, price and condition.</p></div>
          <div className="feature"><ShieldCheck /><h3>Know what you are comparing</h3><p>Review condition, battery health and seller notes before deciding which listing to open.</p></div>
          <div className="feature"><ExternalLink /><h3>Contact the seller directly</h3><p>Open the original Facebook Marketplace listing to ask questions and arrange the purchase.</p></div>
        </div>
      </section>

      <section className="section">
        <div className="container sell-banner">
          <div><div className="eyebrow">SELLING A LAPTOP OR COMPUTER?</div><h2>Help Calgary buyers find it.</h2><p>Create a clear listing with searchable specifications and link it to your Facebook Marketplace post.</p></div>
          <Link className="button" href="/sell">List a computer</Link>
        </div>
      </section>
    </main>
  );
}
