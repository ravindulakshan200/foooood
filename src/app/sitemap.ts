import { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sorrisofood.lk";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/menu", "/cart", "/track", "/contact", "/reservations"];
  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
