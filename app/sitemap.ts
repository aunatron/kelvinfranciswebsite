import type { MetadataRoute } from "next";
import { getEssays, getNowEntries } from "@/lib/content";
import { RECORDS } from "@/lib/records";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const essays = getEssays().map((e) => ({
    url: `${site.url}/doctrine/${e.slug}/`,
    lastModified: e.date,
  }));
  const latestNow = getNowEntries()[0]?.date;
  const records = RECORDS.map((r) => ({
    url: `${site.url}${r.href}`,
    lastModified: latestNow,
  }));
  return [
    ...records,
    { url: `${site.url}/track-record/`, lastModified: latestNow },
    ...essays,
  ];
}
