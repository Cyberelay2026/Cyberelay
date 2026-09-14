import { randomUUID } from "node:crypto";

export function createListingSlug(value: string) {
  const base = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72) || "computer";
  return `${base}-${randomUUID().slice(0, 8)}`;
}
