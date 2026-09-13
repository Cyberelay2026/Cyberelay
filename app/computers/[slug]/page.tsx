import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, MapPin, Battery, CheckCircle2 } from "lucide-react";
import { computers } from "@/data/computers";

export function generateStaticParams() {
  return computers.map((computer) => ({ slug: computer.slug }));
}

export default async function ComputerDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const computer = computers.find(c => c.slug === slug);
  if (!computer) notFound();

  return (
    <main className="section">
      <div className="container">
        <Link href="/computers" className="back-link">← Back to computers</Link>
        <div className="detail-grid">
          <div>
            <div className="detail-image"><Image src={computer.image} alt={`${computer.brand} ${computer.model}`} fill sizes="(max-width: 900px) 100vw, 60vw" priority /></div>
            <div className="thumb-row"><div className="thumb active-thumb">Photo 1</div><div className="thumb">More photos coming</div></div>
          </div>
          <aside className="detail-summary">
            <div className="eyebrow">{computer.condition.toUpperCase()} CONDITION</div>
            <h1>{computer.brand} {computer.model}</h1>
            <p className="detail-cpu">{computer.cpu}</p>
            <div className="detail-price">${computer.price.toLocaleString()} <small>CAD</small></div>
            <div className="detail-meta"><span><MapPin size={18}/>{computer.city}, {computer.province}</span><span><Battery size={18}/>{computer.batteryHealth}% battery health</span></div>
            <a className="button button-wide" href={computer.marketplaceUrl} target="_blank" rel="noreferrer">View on Facebook Marketplace <ExternalLink size={17}/></a>
            <p className="fine-print">You will leave Cyberelay and continue on Facebook Marketplace.</p>
          </aside>
        </div>

        <div className="info-grid">
          <section className="info-card"><h2>Specifications</h2><dl className="spec-list"><div><dt>Processor</dt><dd>{computer.cpu}</dd></div><div><dt>Memory</dt><dd>{computer.ram}GB</dd></div><div><dt>Storage</dt><dd>{computer.storage}GB {computer.storageType}</dd></div><div><dt>Graphics</dt><dd>{computer.gpu}</dd></div><div><dt>Display</dt><dd>{computer.display}</dd></div><div><dt>Operating system</dt><dd>{computer.os}</dd></div></dl></section>
          <section className="info-card"><h2>Condition</h2><div className="condition-line"><CheckCircle2/><div><strong>{computer.condition}</strong><p>{computer.description}</p></div></div><dl className="spec-list compact"><div><dt>Battery health</dt><dd>{computer.batteryHealth}%</dd></div><div><dt>Charger</dt><dd>Included</dd></div></dl></section>
        </div>
      </div>
    </main>
  );
}
