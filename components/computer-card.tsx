import Link from "next/link";
import type { PublicComputer } from "@/lib/computer";

export function ComputerCard({ computer }: { computer: PublicComputer }) {
  const storage = computer.storage >= 1024 && computer.storage % 1024 === 0
    ? `${computer.storage / 1024}TB`
    : `${computer.storage}GB`;
  return (
    <Link href={`/computers/${computer.slug}`} className="computer-card">
      <div className="card-image-wrap">
        <img src={computer.image} alt={`${computer.brand} ${computer.model}`} loading="lazy" />
      </div>
      <div className="card-body">
        <div className="card-topline"><span>{computer.condition}</span><span>{computer.city}, {computer.province}</span></div>
        <h3>{computer.brand} {computer.model}</h3>
        <p>{computer.cpu}</p>
        <p>{computer.ram}GB RAM · {storage} {computer.storageType}</p>
        <div className="card-price">${computer.price.toLocaleString()} CAD</div>
      </div>
    </Link>
  );
}
