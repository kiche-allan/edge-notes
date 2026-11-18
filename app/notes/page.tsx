import Link from "next/link";
import type { Metadata } from "next";
import { PostRow, LaneLabel } from "@/components/PostCard";
import SubscribeBand from "@/components/SubscribeBand";
import { RssIcon } from "@/components/Icons";
import { formatDate, getPosts, LANES } from "@/lib/posts";
import { ISSUES, SERIES } from "@/lib/site";

export const metadata: Metadata = { title: "Notes" };

type Props = { searchParams: Promise<{ lane?: string; topic?: string }> };

export default async function NotesPage({ searchParams }: Props) {
  const { lane, topic } = await searchParams;
  const all = getPosts();
  const posts = all.filter((p) => (!lane || p.lane === lane) && (!topic || p.topics.includes(topic)));
  const featured = !lane && !topic ? all.find((p) => p.featured) : undefined;
  const topics = [...new Set(all.flatMap((p) => p.topics))].sort();
  const years = [...new Set(all.map((p) => p.date.slice(0, 4)))];

  return (
    <>
      <section className="wrap stack" style={{ padding: "72px 32px 40px", gap: 28 }}>
        <div className="between" style={{ alignItems: "flex-end" }}>
          <h1 className="display">Notes</h1>
          <a href="/rss.xml" className="btn sm"><RssIcon />RSS</a>
        </div>
        <p className="lede">Research, builds, guitar, health and the rest. One feed; pick the lane you came for.</p>
        <nav aria-label="Lanes" style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link href="/notes" className="btn sm" aria-pressed={!lane && !topic}>All</Link>
          {LANES.map((l) => (
            <Link key={l.id} href={`/notes?lane=${l.id}`} className="btn sm" aria-pressed={lane === l.id}>{l.label}</Link>
          ))}
        </nav>
        {topic && <p style={{ margin: 0 }}>Topic: <strong>{topic}</strong> · <Link href="/notes" className="link">clear</Link></p>}
      </section>

      {featured && (
        <section className="wrap" style={{ paddingBottom: 48 }}>
          <article style={{ borderTop: "2px solid var(--ink)", borderBottom: "1px solid var(--rule)", padding: "40px 0", display: "flex", flexWrap: "wrap", gap: 48 }}>
            <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="kicker sm">Featured · <LaneLabel lane={featured.lane} /></div>
              <div className="dim" style={{ fontSize: 14 }}>{formatDate(featured.date)}</div>
            </div>
            <div style={{ flex: "3 1 480px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
              <h2 className="h2" style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}><Link href={`/notes/${featured.slug}`}>{featured.title}</Link></h2>
              <p className="serif" style={{ margin: 0, fontSize: 22, color: "var(--muted)" }}>{featured.dek}</p>
              <Link href={`/notes/${featured.slug}`} className="link" style={{ alignSelf: "flex-start" }}>Read the note</Link>
            </div>
          </article>
        </section>
      )}

      {!lane && !topic && (
        <section className="wrap stack" style={{ paddingBottom: 56 }}>
          <div className="between">
            <h2 className="h2" style={{ fontSize: 32 }}>Routes</h2>
            <span className="dim" style={{ fontSize: 14 }}>Series, drawn as matatu routes. Filled stops are out; hollow ones are coming.</span>
          </div>
          {SERIES.map((s) => {
            const out = new Map(all.filter((p) => p.series === s.id && p.part).map((p) => [p.part!, p]));
            return (
              <div key={s.id} className="route">
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 18px" }}>
                  <span className="route-badge">Route {s.num}</span>
                  <span className="serif" style={{ fontSize: 26, lineHeight: 1.2 }}>{s.title}</span>
                  <span className="dim" style={{ fontSize: 14, marginLeft: "auto" }}>{out.size} of {s.stops.length} stops</span>
                </div>
                <ol className="route-line" style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {s.stops.map((label, i) => {
                    const post = out.get(i + 1);
                    return (
                      <li key={i} className={post ? "stop out" : "stop"}>
                        <i />
                        <span className="dim" style={{ fontSize: 12 }}>Stop {i + 1}</span>
                        {post ? <Link href={`/notes/${post.slug}`}>{post.title.split(":")[0]}</Link> : <span>{label}</span>}
                      </li>
                    );
                  })}
                </ol>
                <span className="muted" style={{ fontSize: 15 }}>{s.dek}</span>
              </div>
            );
          })}
        </section>
      )}

      <section className="wrap row" style={{ paddingBottom: 72, gap: 56 }}>
        <div style={{ flex: "999 1 560px", minWidth: 0 }}>
          <h2 className="h2" style={{ fontSize: 32, marginBottom: 8 }}>{lane || topic ? "Matching notes" : "Latest"}</h2>
          {posts.length ? posts.map((p) => <PostRow key={p.slug} post={p} />) : (
            <p className="muted" style={{ padding: "24px 0", borderTop: "1px solid var(--rule)" }}>Nothing in this lane yet. It&apos;s coming.</p>
          )}
        </div>
        <aside id="topics" style={{ flex: "1 1 260px", minWidth: 0, display: "flex", flexDirection: "column", gap: 32 }}>
          <div className="stack" style={{ gap: 14 }}>
            <h2 className="kicker sm" style={{ margin: 0 }}>Topics</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {topics.map((t) => <Link key={t} href={`/notes?topic=${encodeURIComponent(t)}`} className="chip">{t}</Link>)}
            </div>
          </div>
          <div id="archive" className="stack" style={{ gap: 10 }}>
            <h2 className="kicker sm" style={{ margin: 0 }}>Newsletter archive</h2>
            {ISSUES.length ? ISSUES.map((i) => (
              <a key={i.href} href={i.href} style={{ borderTop: "1px solid var(--rule)", padding: "12px 0", display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span className="serif" style={{ fontSize: 18 }}>{i.title}</span><span className="dim" style={{ fontSize: 13 }}>{i.date}</span>
              </a>
            )) : <p className="dim" style={{ margin: 0, fontSize: 14 }}>The first issue goes out soon.</p>}
          </div>
          <div className="stack" style={{ gap: 10 }}>
            <h2 className="kicker sm" style={{ margin: 0 }}>By year</h2>
            <div style={{ display: "flex", gap: 16, fontWeight: 600 }}>{years.map((y) => <span key={y}>{y}</span>)}</div>
          </div>
        </aside>
      </section>

      <SubscribeBand title="Get the next note when it ships." id="email-notes" />
    </>
  );
}
