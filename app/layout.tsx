import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OfflineBanner from "@/components/OfflineBanner";
import { SITE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${SITE.name} · ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = { themeColor: "#B4472B", width: "device-width", initialScale: 1 };

// Runs before paint so dark-mode readers never see a cream flash.
const themeScript = `try{var t=localStorage.getItem('theme');if(!t&&matchMedia('(prefers-color-scheme: dark)').matches)t='dark';document.documentElement.dataset.theme=t||'light'}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Hanken+Grotesk:wght@400;500;600&family=VT323&display=swap"
        />
      </head>
      <body>
        <OfflineBanner />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
