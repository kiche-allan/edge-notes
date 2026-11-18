import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <span>Edge Notes · Nairobi, Kenya</span>
        <nav aria-label="Footer">
          <Link href="/notes">Notes</Link>
          <Link href="/notes#topics">Topics</Link>
          <Link href="/fail-log">Fail log</Link>
          <Link href="/ussd">USSD</Link>
          <Link href="/lab">Lab</Link>
          <Link href="/work">Work</Link>
          <Link href="/now#uses">Uses</Link>
          <a href="/rss.xml">RSS</a>
        </nav>
      </div>
    </footer>
  );
}
