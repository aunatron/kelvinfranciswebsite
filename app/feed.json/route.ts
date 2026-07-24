import { getEssays } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamic = "force-static";

/** JSON Feed 1.1 — published essays only. Empty until something is published; never padded. */
export function GET() {
  const items = getEssays()
    .filter((e) => e.status === "published")
    .map((e) => ({
      id: `${site.url}/doctrine/${e.slug}/`,
      url: `${site.url}/doctrine/${e.slug}/`,
      title: `${e.record} — ${e.title}`,
      summary: e.summary,
      date_published: `${e.date}T00:00:00Z`,
      tags: e.tags,
    }));

  return Response.json({
    version: "https://jsonfeed.org/version/1.1",
    title: site.title,
    home_page_url: site.url,
    feed_url: `${site.url}/feed.json`,
    description: site.description,
    authors: [{ name: site.name, url: site.url }],
    language: "en",
    items,
  });
}
