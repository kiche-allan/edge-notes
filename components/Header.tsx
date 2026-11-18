"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { SearchIcon } from "./Icons";

const LINKS = [
  { href: "/notes", label: "Notes" },
  { href: "/lab", label: "Lab" },
  { href: "/work", label: "Work" },
  { href: "/now", label: "Now" },
];

export default function Header() {
  const path = usePathname() ?? "/";
  const current = (href: string) => (path === href || path.startsWith(href + "/") ? "page" : undefined);
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="logo">Edge Notes<span>.</span></Link>
        <nav className="nav" aria-label="Main">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={current(l.href)}>{l.label}</Link>
          ))}
          <Link href="/ask" className={current("/ask") ? "btn sm ink" : "btn sm"}><SearchIcon />Ask</Link>
          <ThemeToggle />
          <Link href="/#subscribe" className="btn sm ink">Subscribe</Link>
        </nav>
      </div>
    </header>
  );
}
