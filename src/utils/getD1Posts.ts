import type { CollectionEntry } from "astro:content";
import config from "@/config";
import { env } from "cloudflare:workers";

export async function getD1Posts(Astro: any): Promise<CollectionEntry<"posts">[]> {
  const db = env?.DB;
  if (!db) {
    console.warn("D1 Database not found in env.DB");
    return [];
  }

  try {
    const { results } = await db.prepare("SELECT * FROM posts WHERE status = 'publish' ORDER BY created_at DESC").all();
    if (!results) return [];

    return results.map((row: any) => {
      return {
        id: row.slug,
        slug: row.slug,
        body: row.body || "",
        collection: "posts",
        filePath: undefined, // Dynamic posts don't have file paths
        data: {
          title: row.title || "Untitled",
          description: (row.body || "").replace(/<[^>]*>?/gm, '').substring(0, 150) + "...",
          pubDatetime: new Date(row.created_at),
          modDatetime: null,
          tags: row.tags ? row.tags.split(",").map((t: string) => t.trim()) : ["others"],
          ogImage: row.featured_image || undefined,
          canonicalURL: undefined,
          hideEditPost: true,
          author: row.author || config.site.author,
          featured: false,
          draft: false,
          timezone: undefined,
        }
      };
    }) as CollectionEntry<"posts">[];
  } catch (error) {
    console.error("Error fetching posts from D1:", error);
    return [];
  }
}
