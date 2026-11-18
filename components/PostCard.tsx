import Link from "next/link";
import { formatDate, laneOf, type Post } from "@/lib/posts";

export function LaneLabel({ lane }: { lane: string }) {
  const l = laneOf(lane);
  return <div className="lane" style={{ color: l.color }}>{l.label}</div>;
}

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="post-card">
      <LaneLabel lane={post.lane} />
      <h3 className="h3"><Link href={`/notes/${post.slug}`}>{post.title}</Link></h3>
      <p className="muted" style={{ margin: 0 }}>{post.dek}</p>
      <div className="dim" style={{ fontSize: 14 }}>{formatDate(post.date)} · {post.readMinutes} min</div>
    </article>
  );
}

export function PostRow({ post }: { post: Post }) {
  return (
    <article className="post-row">
      <div>
        <LaneLabel lane={post.lane} />
        <div className="dim" style={{ fontSize: 14 }}>{formatDate(post.date)}</div>
      </div>
      <div>
        <h3 className="h3" style={{ fontSize: 26 }}><Link href={`/notes/${post.slug}`}>{post.title}</Link></h3>
        <p className="muted" style={{ margin: 0 }}>{post.dek}</p>
      </div>
    </article>
  );
}
