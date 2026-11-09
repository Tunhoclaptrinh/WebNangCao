import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/dashboard", "/login", "/api/", "/403"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
