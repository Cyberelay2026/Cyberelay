import type { MetadataRoute } from "next";
import { getPublicListingSlugs } from "@/lib/public-listings";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await getPublicListingSlugs();
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/computers`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/sell`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
  ];

  return [
    ...staticPages,
    ...listings.map((listing) => ({
      url: `${SITE_URL}/computers/${encodeURIComponent(listing.slug)}`,
      lastModified: listing.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
