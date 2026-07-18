import type { MetadataRoute } from "next";
import { getAllPlayers } from "@/lib/db/players";

const STATIC_ROUTES = [
  "",
  "/players",
  "/matches",
  "/ai-team",
  "/community",
  "/my-squad",
  "/mypage",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const players = await getAllPlayers();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  const playerEntries: MetadataRoute.Sitemap = players
    .filter((p) => p.officialSquad)
    .map((p) => ({
      url: `${baseUrl}/players/${p.id}`,
      lastModified: new Date(),
    }));

  return [...staticEntries, ...playerEntries];
}
