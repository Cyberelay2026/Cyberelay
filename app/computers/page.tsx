import { ComputerBrowser } from "@/components/computer-browser";
import { getPublicComputers } from "@/lib/public-listings";

export const dynamic = "force-dynamic";

export default async function ComputersPage() {
  const { computers, error } = await getPublicComputers();
  return <ComputerBrowser computers={computers} loadError={error} />;
}
