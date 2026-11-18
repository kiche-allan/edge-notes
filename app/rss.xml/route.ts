import { getPosts } from "@/lib/posts";
import { SITE } from "@/lib/site";

const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);

export async function GET(req: Request) {
  const base = process.env.SITE_URL ?? new URL(req.url).origin;
  const items = getPosts().map((p) => `<item><title>${esc(p.title)}</title><link>${base}/notes/${p.slug}</link><guid>${base}/notes/${p.slug}</guid><pubDate>${new Date(p.date).toUTCString()}</pubDate><description>${esc(p.dek)}</description></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${SITE.name}</title><link>${base}</link><description>${esc(SITE.description)}</description><language>en-GB</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
