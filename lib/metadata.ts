import type { Metadata } from "next";
import { site } from "./site";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const canonical = new URL(path, site.url).toString();
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: "The Human Attestation",
      images: [
        {
          url: "/social-card.jpg",
          width: 1200,
          height: 630,
          alt: "The Human Attestation, represented by Kelvin-Francis Peprah's gold wireframe operator scene.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/social-card.jpg"],
    },
  };
}
