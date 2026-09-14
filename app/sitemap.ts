import type { MetadataRoute } from "next";
import { getPublicListingSlugs } from "@/lib/public-listings";

const baseUrl = "https://www.cyberelay.ca";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await getPublicListingSlugs();
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/computers`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/sell`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
  ];

  return [
    ...staticPages,
    ...listings.map((listing) => ({
      url: `${baseUrl}/computers/${encodeURIComponent(listing.slug)}`,
      lastModified: listing.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
