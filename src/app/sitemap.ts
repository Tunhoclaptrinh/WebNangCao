import { MetadataRoute } from "next";
import { getSubjects, getDeadlines } from "@/lib/data";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const subjects = await getSubjects();
  const deadlines = await getDeadlines();

  const staticRoutes = [
    {
      url: `${siteConfig.url}/`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/deadlines`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.9,
    },
  ];

  const subjectRoutes = subjects.map((s) => ({
    url: `${siteConfig.url}/subjects/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const deadlineRoutes = deadlines.map((d) => ({
    url: `${siteConfig.url}/deadlines/${d.id}`,
    lastModified: new Date(d.updatedAt || d.createdAt || Date.now()),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...subjectRoutes, ...deadlineRoutes];
}
