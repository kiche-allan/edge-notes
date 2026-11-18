import Link from "next/link";
import NetworkFigure from "@/components/NetworkFigure";
import { PostCard } from "@/components/PostCard";
import SubscribeBand from "@/components/SubscribeBand";
import { MicIcon, PhoneIcon } from "@/components/Icons";
import { getPosts } from "@/lib/posts";
import { NOW, PAPERS, SHELF, SITE } from "@/lib/site";

export default function Home() {
  const posts = getPosts().slice(0, 3);
  const [nowA, nowB] = NOW.items;

  return (
    <>
      <Link href="/now" className="now-strip">
        <div className="wrap">
          <span className="kicker sm" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><span className="dot" />Now · {NOW.updated}</span>
          <span>{nowA.text.split(":")[0]} · {nowB.text.split(",")[0]}</span>
          <span className="link">What I&apos;m on</span>
        </div>
      </Link>

      <div className="wrap">
        <section className="hero">
          <div>
            <div className="kicker">Dispatches from Nairobi</div>
            <h1 className="display">Notes from the <em>edge</em> of the network.</h1>
            <p className="lede">{SITE.description}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              <Link href="/notes" className="btn primary">Read the notes</Link>
              <Link href="/lab" className="btn">Play in the Lab</Link>
            </div>
            <div className="alt-ways">
              <Link href="/ussd" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><PhoneIcon />No data? Dial <strong>{SITE.ussdCode}</strong></Link>
              <Link href="/notes/why-one-scheduler-isnt-enough?lang=sw">Soma kwa Kiswahili</Link>
              <span>Works offline</span>
            </div>
          </div>
          <NetworkFigure />
        </section>

        <section style={{ paddingBottom: 72 }}>
          <form action="/ask" method="get" className="askbox">
            <label htmlFor="ask" className="kicker sm">Ask the Notes</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <input id="ask" name="q" className="field" placeholder="How does PRISM decide where a task runs?" />
              <button className="btn ink" style={{ minHeight: 56, borderRadius: 10 }}>Ask</button>
            </div>
            <div className="dim" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 10px", fontSize: 14 }}>
              <span>Answers come only from what I&apos;ve written, with citations. Try:</span>
              <Link className="chip" href="/ask?q=What+is+a+multi-coordinator+setup">What&apos;s a multi-coordinator setup?</Link>
              <Link className="chip" href="/ask?q=How+does+the+Swahili+bot+handle+voice">How does the Swahili bot handle voice?</Link>
            </div>
          </form>
        </section>
      </div>

      <section className="top-rule">
        <div className="wrap section stack" style={{ gap: 40 }}>
          <div className="between">
            <h2 className="h2">Latest dispatches</h2>
            <Link href="/notes" className="link">All notes</Link>
          </div>
          <div className="row">{posts.map((p) => <PostCard key={p.slug} post={p} />)}</div>
        </div>
      </section>

      <section className="night">
        <div className="wrap section stack" style={{ gap: 40 }}>
          <div className="row" style={{ alignItems: "center", gap: 56 }}>
            <div className="grow stack" style={{ flexBasis: 440 }}>
              <div className="kicker">The Lab · Experiment 01</div>
              <h2 className="h2" style={{ fontSize: "clamp(36px, 5vw, 56px)" }}>Place the Task. Beat the baseline.</h2>
              <p className="lede">You are the scheduler. Tasks arrive, edge nodes fill up, latency climbs. Put each task on a node, then see how a scheduling policy handled the exact same sequence.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <Link href="/lab#place-the-task" className="btn glow">Play a round</Link>
                <Link href="/notes/why-one-scheduler-isnt-enough" className="btn ghost">Read the theory</Link>
              </div>
            </div>
            <div className="grow row" style={{ flexBasis: 420, gap: 20 }}>
              <Link href="/lab#break-the-network" className="lab-card grow" style={{ flexBasis: 200 }}>
                <span className="kicker sm">Experiment 02</span>
                <span className="serif" style={{ fontSize: 28 }}>Break the Network</span>
                <span className="muted">Knock out a node and watch traffic reroute.</span>
              </Link>
              <Link href="/lab#watch-it-learn" className="lab-card grow" style={{ flexBasis: 200 }}>
                <span className="kicker sm">Experiment 03</span>
                <span className="serif" style={{ fontSize: 28 }}>Watch it learn</span>
                <span className="muted">Scrub through a training run, episode by episode.</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap section stack" style={{ gap: 40 }}>
          <div className="between">
            <h2 className="h2">The work, explained and touchable</h2>
            <Link href="/work" className="link">All papers and demos</Link>
          </div>
          <div className="row">
            <div className="grow" style={{ flexBasis: 460 }}>
              <div className="kicker sm" style={{ paddingBottom: 12 }}>Papers, explained</div>
              {PAPERS.map((p, i) => (
                <Link key={p.title} href="/work" style={{ borderTop: i ? "1px solid var(--rule)" : "2px solid var(--ink)", padding: "20px 0", display: "flex", flexDirection: "column", gap: 6 }}>
                  <span className="serif" style={{ fontSize: 26, lineHeight: 1.2 }}>{p.title.split(":")[0]}</span>
                  <span className="muted">In plain words: {p.plain}</span>
                </Link>
              ))}
            </div>
            <div className="grow stack" style={{ flexBasis: 460, gap: 16 }}>
              <div className="kicker sm" style={{ color: "var(--green)" }}>Demos you can touch</div>
              <Link href="/work#sauti" className="card" style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <span className="avatar" style={{ width: 52, height: 52, background: "var(--green)", color: "#F6F0E4" }}><MicIcon /></span>
                <span><span className="serif" style={{ fontSize: 24, display: "block" }}>Sauti ya Sheria</span><span className="muted">Ask about Kenya&apos;s data law in Swahili. Hear the answer.</span></span>
              </Link>
              <Link href="/work#compliance" className="card" style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <span className="avatar" style={{ width: 52, height: 52, background: "var(--ink)", color: "var(--bg)" }}>§</span>
                <span><span className="serif" style={{ fontSize: 24, display: "block" }}>Compliance RAG</span><span className="muted">Questions on Kenyan compliance law, answered with the clause it came from.</span></span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="office-hours" className="top-rule">
        <div className="wrap section row" style={{ gap: 64 }}>
          <div className="grow stack" style={{ flexBasis: 420 }}>
            <div className="kicker">Office hours</div>
            <h2 className="h2">Bring a hard problem. Get thirty honest minutes.</h2>
            <p className="lede" style={{ fontSize: 18 }}>System design, a research idea, a side project that stalled. A short call, then written notes you can keep.</p>
            <div>
              {SITE.bookingUrl ? (
                <a href={SITE.bookingUrl} className="btn ink" target="_blank" rel="noopener noreferrer">Book a slot</a>
              ) : (
                <span className="chip">Booking opens soon</span>
              )}
            </div>
          </div>
          <ol className="grow" style={{ flexBasis: 380, margin: 0, padding: 0, listStyle: "none" }}>
            {[
              ["Pick a time", "Choose from the weekly slots I publish."],
              ["Share a brief", "A repo, a sketch or three sentences on what is stuck."],
              ["Talk, then get notes", "Thirty minutes on a call, a written summary after."],
            ].map(([t, d], i) => (
              <li key={t} style={{ display: "flex", gap: 24, padding: "24px 0", borderTop: i ? "1px solid var(--rule)" : "2px solid var(--ink)", borderBottom: i === 2 ? "1px solid var(--rule)" : undefined }}>
                <span className="serif" style={{ fontSize: 36, color: "var(--accent)", lineHeight: 1 }}>{i + 1}</span>
                <div><div style={{ fontWeight: 600, fontSize: 18 }}>{t}</div><div className="muted">{d}</div></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band">
        <div className="wrap section row">
          <div className="grow stack" style={{ flexBasis: 360, gap: 16 }}>
            <h2 className="h2">What I&apos;m reading</h2>
            <p className="lede" style={{ fontSize: 18 }}>Books and papers, each with the one line I&apos;d underline.</p>
          </div>
          <div className="grow" style={{ flexBasis: 460 }}>
            {SHELF.slice(0, 2).map((b, i) => (
              <Link key={i} href="/now#shelf" style={{ borderTop: i ? "1px solid var(--rule)" : "2px solid var(--ink)", padding: "16px 0", display: "flex", flexDirection: "column", gap: 4 }}>
                <span className="serif" style={{ fontSize: 22 }}>{b.title}</span>
                <span className="serif muted" style={{ fontStyle: "italic" }}>&ldquo;{b.note}&rdquo;</span>
              </Link>
            ))}
            <Link href="/now#shelf" className="link">Full shelf</Link>
          </div>
        </div>
      </section>

      <section id="about" className="top-rule">
        <div className="wrap section row" style={{ alignItems: "flex-start", gap: 48 }}>
          <h2 className="h2 grow" style={{ flexBasis: 280, fontSize: 36 }}>Who is writing this</h2>
          <div className="stack" style={{ flex: "2 1 460px", gap: 16 }}>
            <p className="serif" style={{ margin: 0, fontSize: 24, lineHeight: 1.5 }}>
              I&apos;m Allan, a research analyst working on distributed systems, edge computing and reinforcement learning, based in Nairobi. This site is where the work gets written down in plain language, next to the guitar, the training and everything else I care about.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              <Link href="/now" className="link">Now</Link>
              <Link href="/now#uses" className="link">Uses</Link>
              <Link href="/now#shelf" className="link">Shelf</Link>
            </div>
          </div>
        </div>
      </section>

      <SubscribeBand />
    </>
  );
}
