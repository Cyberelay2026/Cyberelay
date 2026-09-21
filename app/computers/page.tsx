import { ComputerBrowser } from "@/components/computer-browser";
import { getPublicComputers } from "@/lib/public-listings";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Used Laptops & Computers in Calgary",
  description: "Find used laptops and computers for sale in Calgary. Compare price, processor, RAM, storage and condition, then contact the seller on Marketplace.",
  alternates: { canonical: "/computers" },
};

export default async function ComputersPage() {
  const { computers, error } = await getPublicComputers();
  return <ComputerBrowser computers={computers} loadError={error} />;
}
