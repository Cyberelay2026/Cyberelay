import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ExternalLink, MapPin, Battery, CheckCircle2 } from "lucide-react";
import { getPublicComputer } from "@/lib/public-listings";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

function listingDescription(computer: NonNullable<Awaited<ReturnType<typeof getPublicComputer>>>) {
  return `${computer.brand} ${computer.model} with ${computer.cpu}, ${computer.ram}GB RAM and ${storageLabel(computer.storage)} ${computer.storageType}. ${computer.condition} condition in ${computer.city}, ${computer.province}.`;
}

function schemaCondition(condition: string) {
  if (condition === "New") return "https://schema.org/NewCondition";
  if (condition === "Poor") return "https://schema.org/DamagedCondition";
  return "https://schema.org/UsedCondition";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const computer = await getPublicComputer(slug);
  if (!computer) return { title: "Computer not found", robots: { index: false, follow: false } };
  const title = `${computer.brand} ${computer.model} — $${computer.price.toLocaleString("en-CA")} CAD`;
  const description = listingDescription(computer);
  const path = `/computers/${computer.slug}`;
  const image = computer.image !== "/laptop-placeholder.svg" ? computer.image : undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, title, description, images: image ? [{ url: image, alt: `${computer.brand} ${computer.model}` }] : undefined },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, images: image ? [image] : undefined },
  };
}

function storageLabel(value: number) {
  return value >= 1024 && value % 1024 === 0 ? `${value / 1024}TB` : `${value}GB`;
}

export default async function ComputerDetail({ params }: PageProps) {
  const { slug } = await params;
  const computer = await getPublicComputer(slug);
  if (!computer) notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${computer.brand} ${computer.model}`,
    sku: computer.id,
    description: listingDescription(computer),
    brand: { "@type": "Brand", name: computer.brand },
    model: computer.model,
    ...(computer.image !== "/laptop-placeholder.svg" ? { image: computer.images.length ? computer.images : [computer.image] } : {}),
    itemCondition: schemaCondition(computer.condition),
    offers: {
      "@type": "Offer",
      url: `https://www.cyberelay.ca/computers/${computer.slug}`,
      priceCurrency: "CAD",
      price: computer.price.toFixed(2),
      availability: "https://schema.org/InStock",
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Processor", value: computer.cpu },
      { "@type": "PropertyValue", name: "Memory", value: `${computer.ram}GB RAM` },
      { "@type": "PropertyValue", name: "Storage", value: `${storageLabel(computer.storage)} ${computer.storageType}` },
      { "@type": "PropertyValue", name: "Graphics", value: computer.gpu },
    ],
  };

  return (
    <main className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }} />
      <div className="container">
        <Link href="/computers" className="back-link">← Back to computers</Link>
        <div className="detail-grid">
          <div>
            <div className="detail-image"><img src={computer.image} alt={computer.brand + " " + computer.model} /></div>
            <div className="thumb-row">
              {(computer.images.length ? computer.images : [computer.image]).map((image, index) => (
                <a className={index === 0 ? "thumb active-thumb" : "thumb"} href={image} target="_blank" rel="noreferrer" key={image}>
                  Photo {index + 1}
                </a>
              ))}
            </div>
          </div>
          <aside className="detail-summary">
            <div className="eyebrow">{computer.condition.toUpperCase()} CONDITION</div>
            <h1>{computer.brand} {computer.model}</h1>
            <p className="detail-cpu">{computer.cpu}</p>
            <div className="detail-price">${computer.price.toLocaleString()} <small>CAD</small></div>
            <div className="detail-meta">
              <span><MapPin size={18}/>{computer.city}, {computer.province}</span>
              {computer.batteryHealth !== null && <span><Battery size={18}/>{computer.batteryHealth}% battery health</span>}
            </div>
            <a className="button button-wide" href={computer.marketplaceUrl} target="_blank" rel="noreferrer">View on Facebook Marketplace <ExternalLink size={17}/></a>
            <p className="fine-print">You will leave Cyberelay and continue on Facebook Marketplace.</p>
          </aside>
        </div>

        <div className="info-grid">
          <section className="info-card"><h2>Specifications</h2><dl className="spec-list"><div><dt>Processor</dt><dd>{computer.cpu}</dd></div><div><dt>Memory</dt><dd>{computer.ram}GB</dd></div><div><dt>Storage</dt><dd>{storageLabel(computer.storage)} {computer.storageType}</dd></div><div><dt>Graphics</dt><dd>{computer.gpu}</dd></div><div><dt>Display</dt><dd>{computer.display}</dd></div><div><dt>Operating system</dt><dd>{computer.os}</dd></div></dl></section>
          <section className="info-card"><h2>Condition</h2><div className="condition-line"><CheckCircle2/><div><strong>{computer.condition}</strong><p>{computer.description}</p>{computer.cosmeticNotes && <p>{computer.cosmeticNotes}</p>}</div></div>{computer.batteryHealth !== null && <dl className="spec-list compact"><div><dt>Battery health</dt><dd>{computer.batteryHealth}%</dd></div></dl>}</section>
        </div>
      </div>
    </main>
  );
}
