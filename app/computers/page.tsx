import { ComputerBrowser } from "@/components/computer-browser";
import { getPublicComputers } from "@/lib/public-listings";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Browse Used Computers",
  description: "Browse used laptops and computers in Calgary by brand, processor, RAM, storage, condition and price.",
  alternates: { canonical: "/computers" },
};

export default async function ComputersPage() {
  const { computers, error } = await getPublicComputers();
  return <ComputerBrowser computers={computers} loadError={error} />;
}
