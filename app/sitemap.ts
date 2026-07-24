import type { MetadataRoute } from "next";
import { getEssays, getNowEntries } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const essays = getEssays().map((e) => ({
    url: `${site.url}/doctrine/${e.slug}/`,
    lastModified: e.date,
  }));
  const latestNow = getNowEntries()[0]?.date;
  return [
    { url: `${site.url}/`, lastModified: latestNow },
    { url: `${site.url}/doctrine/`, lastModified: essays[0]?.lastModified },
    { url: `${site.url}/now/`, lastModified: latestNow },
    ...essays,
  ];
}
