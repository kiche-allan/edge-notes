import { getPosts } from "./posts";
import { PAPERS } from "./site";

// "Ask the Notes": extractive answers from the site's own writing, every sentence cited.
// No external model, so nothing is made up. Swap in pgvector + an LLM later (note_chunks table is ready).

type Chunk = { source: string; href: string; section: string; text: string };
export type Answer = { answered: boolean; parts: { text: string; cite: number }[]; sources: { n: number; title: string; href: string; section: string }[] };

const STOP = new Set("a an and are as at be but by can do does for from how i in is it its of on or so that the this to was what when where which who why will with you your about into than then them they there these those my me we our".split(" "));

const tokens = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));

function chunks(): Chunk[] {
  const out: Chunk[] = [];
  for (const p of getPosts()) {
    let section = "Introduction";
    for (const block of p.text.split(/\n{2,}/)) {
      const b = block.trim();
      if (!b) continue;
      if (/^[A-Z][^.!?]{0,80}$/.test(b) && !b.includes("\n")) { section = b; continue; } // heading line
      if (b.startsWith("[") || b.length < 40) continue; // placeholder or fragment
      out.push({ source: p.title, href: `/notes/${p.slug}`, section, text: b });
    }
  }
  for (const paper of PAPERS) {
    out.push({ source: paper.title.split(":")[0] + ", explained", href: "/work", section: "In plain words", text: paper.plain + " " + paper.why });
  }
  return out;
}

export function ask(question: string): Answer {
  const q = [...new Set(tokens(question))];
  const all = chunks();
  if (!q.length || !all.length) return { answered: false, parts: [], sources: [] };

  const df = new Map<string, number>();
  const docs = all.map((c) => new Set(tokens(c.source + " " + c.text)));
  for (const d of docs) for (const w of q) if (d.has(w)) df.set(w, (df.get(w) ?? 0) + 1);

  const scored = all
    .map((c, i) => {
      let s = 0;
      for (const w of q) if (docs[i].has(w)) s += Math.log(1 + all.length / (df.get(w) ?? 1));
      return { c, s, hits: q.filter((w) => docs[i].has(w)).length };
    })
    .filter((x) => x.hits >= Math.min(2, q.length))
    .sort((a, b) => b.s - a.s)
    .slice(0, 3);

  if (!scored.length) return { answered: false, parts: [], sources: [] };

  const sources: Answer["sources"] = [];
  const parts = scored.map(({ c }) => {
    let n = sources.findIndex((s) => s.href === c.href && s.section === c.section) + 1;
    if (!n) { sources.push({ n: sources.length + 1, title: c.source, href: c.href, section: c.section }); n = sources.length; }
    return { text: c.text, cite: n };
  });
  return { answered: true, parts, sources };
}
