import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/auth", "/seller"],
    },
    sitemap: "https://www.cyberelay.ca/sitemap.xml",
    host: "https://www.cyberelay.ca",
  };
}
