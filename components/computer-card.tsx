import Image from "next/image";
import Link from "next/link";
import type { Computer } from "@/data/computers";

export function ComputerCard({ computer }: { computer: Computer }) {
  return (
    <Link href={`/computers/${computer.slug}`} className="computer-card">
      <div className="card-image-wrap">
        <Image src={computer.image} alt={`${computer.brand} ${computer.model}`} fill sizes="(max-width: 800px) 100vw, 33vw" />
      </div>
      <div className="card-body">
        <div className="card-topline"><span>{computer.condition}</span><span>{computer.city}, {computer.province}</span></div>
        <h3>{computer.brand} {computer.model}</h3>
        <p>{computer.cpu}</p>
        <p>{computer.ram}GB RAM · {computer.storage}GB {computer.storageType}</p>
        <div className="card-price">${computer.price.toLocaleString()} CAD</div>
      </div>
    </Link>
  );
}
