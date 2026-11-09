import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/deadlines", "/subjects/", "/login"],
      disallow: ["/dashboard", "/admin", "/403", "/api/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
