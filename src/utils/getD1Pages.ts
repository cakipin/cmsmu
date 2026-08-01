import { env } from "cloudflare:workers";

export async function getD1Pages(Astro: any): Promise<any[]> {
  const db = env?.DB;
  if (!db) {
    return [];
  }

  try {
    const { results } = await db.prepare("SELECT * FROM pages WHERE status = 'publish' ORDER BY created_at DESC").all();
    if (!results) return [];

    return results.map((row: any) => {
      return {
        id: row.slug,
        slug: row.slug,
        body: row.body || "",
        data: {
          title: row.title || "Untitled",
          description: (row.body || "").replace(/<[^>]*>?/gm, '').substring(0, 150) + "...",
          pubDatetime: new Date(row.created_at),
          modDatetime: null,
          ogImage: row.featured_image || undefined,
          author: row.author,
        }
      };
    });
  } catch (error) {
    console.error("Error fetching pages from D1:", error);
    return [];
  }
}
