import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export type Lane = "research" | "build" | "guitar" | "health" | "off-grid";

export const LANES: { id: Lane; label: string; color: string }[] = [
  { id: "research", label: "Research", color: "var(--accent)" },
  { id: "build", label: "Build log", color: "var(--green)" },
  { id: "guitar", label: "Guitar", color: "var(--plum)" },
  { id: "health", label: "Health", color: "var(--teal)" },
  { id: "off-grid", label: "Off-grid", color: "var(--ochre)" },
];

export const laneOf = (id: string) => LANES.find((l) => l.id === id) ?? LANES[0];

export type Hop = { place: string; what: string };

export type Post = {
  slug: string;
  title: string;
  dek: string;
  lane: Lane;
  date: string;
  series?: string;
  part?: number;
  featured: boolean;
  draft: boolean;
  topics: string[];
  hops: Hop[];
  html: string;
  text: string;
  readMinutes: number;
  sw?: { title: string; dek: string; html: string };
};

const DIR = path.join(process.cwd(), "content", "posts");

/** ==highlight== becomes <mark>, the one markdown extension the posts use. */
function render(md: string): string {
  const withMarks = md.replace(/==([^=\n]+)==/g, "<mark>$1</mark>");
  return marked.parse(withMarks, { async: false }) as string;
}

function plain(md: string): string {
  return md
    .replace(/==([^=\n]+)==/g, "$1")
    .replace(/[#>*_`\[\]]/g, "")
    .replace(/\n{2,}/g, "\n\n")
    .trim();
}

function load(): Post[] {
  if (!fs.existsSync(DIR)) return [];
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".md") && !f.endsWith(".sw.md"));
  return files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const { data, content } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));
    const swFile = path.join(DIR, `${slug}.sw.md`);
    let sw: Post["sw"];
    if (fs.existsSync(swFile)) {
      const s = matter(fs.readFileSync(swFile, "utf8"));
      sw = { title: String(s.data.title ?? data.title), dek: String(s.data.dek ?? ""), html: render(s.content) };
    }
    const text = plain(content);
    const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? "");
    return {
      slug,
      title: String(data.title ?? slug),
      dek: String(data.dek ?? ""),
      lane: (data.lane ?? "research") as Lane,
      date,
      series: data.series ? String(data.series) : undefined,
      part: data.part ? Number(data.part) : undefined,
      featured: Boolean(data.featured),
      draft: Boolean(data.draft),
      topics: Array.isArray(data.topics) ? data.topics.map(String) : [],
      hops: Array.isArray(data.hops) ? (data.hops as Hop[]) : [],
      html: render(content),
      text,
      readMinutes: Math.max(1, Math.round(text.split(/\s+/).length / 220)),
      sw,
    };
  });
}

let cache: Post[] | null = null;

/** Published posts, newest first. Drafts are hidden unless SHOW_DRAFTS=1. */
export function getPosts(): Post[] {
  if (!cache || process.env.NODE_ENV !== "production") {
    cache = load().sort((a, b) => b.date.localeCompare(a.date));
  }
  return process.env.SHOW_DRAFTS === "1" ? cache : cache.filter((p) => !p.draft);
}

export const getPost = (slug: string) => getPosts().find((p) => p.slug === slug);

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
}
