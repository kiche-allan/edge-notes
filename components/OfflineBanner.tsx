"use client";
import { useEffect, useState } from "react";
import { WifiOffIcon } from "./Icons";

/** Registers the service worker and shows a banner while the reader has no connection. */
export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  if (!offline) return null;
  return (
    <div className="offline-banner" role="status">
      <div className="wrap">
        <WifiOffIcon />
        <strong>You&apos;re on the edge.</strong>
        <span style={{ opacity: 0.8 }}>No connection. You&apos;re reading copies saved on this device; anything you post will need a connection.</span>
      </div>
    </div>
  );
}
