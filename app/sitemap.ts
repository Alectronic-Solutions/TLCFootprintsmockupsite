import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/mdx";
import { SITE_URL, toIsoMonthDate } from "@/lib/seo";

/** Static routes plus every resource article, read from the filesystem. */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "/", priority: 1 },
    { path: "/programs", priority: 0.9 },
    { path: "/availability", priority: 0.9 },
    { path: "/tour", priority: 0.9 },
    { path: "/about", priority: 0.8 },
    { path: "/what-to-expect", priority: 0.8 },
    { path: "/faq", priority: 0.7 },
    { path: "/resources", priority: 0.7 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
    { path: "/accessibility", priority: 0.3 },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: `${SITE_URL}${r.path}`,
      changeFrequency: "monthly" as const,
      priority: r.priority,
    })),
    ...getAllArticles().map((a) => ({
      url: `${SITE_URL}/resources/${a.slug}`,
      lastModified: toIsoMonthDate(a.updated),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
