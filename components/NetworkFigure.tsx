import Link from "next/link";

// Allan at the centre, everything the site covers around him. Work nodes are cream, life nodes green.
const NODES = [
  { x: 270, y: 70, lx: 270, ly: 40, name: "PRISM", sub: "research", href: "/work", life: false },
  { x: 383, y: 117, lx: 383, ly: 87, name: "Cozaik", sub: "research", href: "/work", life: false },
  { x: 430, y: 230, lx: 430, ly: 260, name: "Sauti ya Sheria", sub: "voice bot", href: "/work", life: false },
  { x: 383, y: 343, lx: 383, ly: 373, name: "Compliance RAG", sub: "legal AI", href: "/work", life: false },
  { x: 270, y: 390, lx: 270, ly: 420, name: "Kubernetes", sub: "learning", href: "/notes?topic=Kubernetes", life: false },
  { x: 157, y: 343, lx: 157, ly: 373, name: "Fail log", sub: "what broke", href: "/fail-log", life: false },
  { x: 110, y: 230, lx: 110, ly: 260, name: "Health", sub: "body & mind", href: "/notes?lane=health", life: true },
  { x: 157, y: 117, lx: 157, ly: 87, name: "Guitar", sub: "music", href: "/notes?lane=guitar", life: true },
];

export default function NetworkFigure() {
  const ring = NODES.map((n) => `${n.x},${n.y}`).join(" ");
  return (
    <figure>
      <svg viewBox="0 0 540 450" role="img" aria-label="A network of everything this site covers, with Allan at the centre" style={{ width: "100%", height: "auto", display: "block" }}>
        <g stroke="var(--ink)" strokeWidth="1" fill="none" opacity="0.35">
          {NODES.map((n) => <line key={n.name} x1="270" y1="230" x2={n.x} y2={n.y} />)}
          <polygon points={ring} strokeDasharray="4 5" />
        </g>
        <circle cx="270" cy="230" r="42" fill="none" stroke="var(--accent)" opacity="0.4" />
        <circle cx="270" cy="230" r="62" fill="none" stroke="var(--accent)" opacity="0.2" />
        <circle cx="270" cy="230" r="25" fill="var(--accent)" />
        <text x="270" y="235" textAnchor="middle" fontFamily="var(--sans)" fontSize="13" fontWeight="600" fill="var(--on-accent)">Allan</text>
        <g fill="var(--accent)">
          <circle cx="326" cy="173" r="3.5"><animate attributeName="opacity" values="1;0.2;1" dur="3s" repeatCount="indefinite" /></circle>
          <circle cx="326" cy="287" r="3.5" />
          <circle cx="213" cy="173" r="3.5" />
          <circle cx="190" cy="230" r="3.5"><animate attributeName="opacity" values="0.2;1;0.2" dur="2.4s" repeatCount="indefinite" /></circle>
        </g>
        {NODES.map((n) => (
          <Link key={n.name} href={n.href} className="net-node" aria-label={`${n.name}: ${n.sub}`}>
            <circle cx={n.x} cy={n.y} r="10" fill={n.life ? "var(--green)" : "var(--bg)"} stroke="var(--ink)" strokeWidth="1.5" />
            <text x={n.lx} y={n.ly} textAnchor="middle" fontFamily="var(--sans)" fontSize="14" fontWeight="600" fill={n.life ? "var(--green)" : "var(--ink)"}>{n.name}</text>
            <text x={n.lx} y={n.ly + 14} textAnchor="middle" fontFamily="var(--sans)" fontSize="11" fill="var(--muted2)">{n.sub}</text>
          </Link>
        ))}
      </svg>
      <figcaption className="caption">Fig. 1. Everything I love, routed through one node. Tap a node to go there.</figcaption>
    </figure>
  );
}
