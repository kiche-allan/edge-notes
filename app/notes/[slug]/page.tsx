import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import PostReader from "@/components/PostReader";
import { getPost, getPosts, laneOf, formatDate } from "@/lib/posts";
import { SERIES } from "@/lib/site";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ lang?: string }> };

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  return post ? { title: post.title, description: post.dek } : {};
}

export default async function PostPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const post = getPost(slug);
  if (!post) notFound();

  const series = SERIES.find((s) => s.id === post.series);
  const siblings = getPosts().filter((p) => p.series && p.series === post.series);
  const prev = siblings.find((p) => p.part === (post.part ?? 0) - 1);
  const next = siblings.find((p) => p.part === (post.part ?? 0) + 1);
  const kicker = `${laneOf(post.lane).label}${series ? ` · ${series.title}, part ${post.part} of ${series.stops.length}` : ""}`;

  return (
    <>
      <PostReader
        slug={post.slug}
        kicker={kicker}
        date={formatDate(post.date)}
        readMinutes={post.readMinutes}
        en={{ title: post.title, dek: post.dek, html: post.html }}
        sw={post.sw}
        startLang={lang === "sw" && post.sw ? "sw" : "en"}
        hops={post.hops}
      />
      {(prev || next || series) && (
        <section className="top-rule">
          <div className="wrap row" style={{ padding: "48px 32px 72px", gap: 24 }}>
            <div className="grow stack" style={{ gap: 8 }}>
              <span className="kicker sm" style={{ color: "var(--muted2)" }}>Previous</span>
              {prev ? <Link href={`/notes/${prev.slug}`} className="serif" style={{ fontSize: 22 }}>{prev.title}</Link> : <span className="serif dim" style={{ fontSize: 22 }}>This is the first stop.</span>}
            </div>
            <div className="grow stack" style={{ gap: 8, textAlign: "right" }}>
              <span className="kicker sm">Next stop</span>
              {next ? <Link href={`/notes/${next.slug}`} className="serif" style={{ fontSize: 22 }}>{next.title}</Link> : <span className="serif dim" style={{ fontSize: 22 }}>{series?.stops[post.part ?? 0] ?? "Coming soon"}</span>}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
