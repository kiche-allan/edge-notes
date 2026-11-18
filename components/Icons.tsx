const base = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...base}><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.6" y2="16.6" /></svg>
);
export const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
);
export const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
);
export const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...base}><rect x="6" y="2" width="12" height="20" rx="2" /><line x1="11" y1="18" x2="13" y2="18" /></svg>
);
export const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...base}><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></svg>
);
export const MicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...base}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><line x1="12" y1="18" x2="12" y2="21" /></svg>
);
export const ChatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...base}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
);
export const RssIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...base}><path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1" /></svg>
);
export const WifiOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base}><line x1="2" y1="2" x2="22" y2="22" /><path d="M8.5 16.5a5 5 0 0 1 7 0M5 12.9a10 10 0 0 1 5.2-2.8M19 12.9a10 10 0 0 0-2.3-1.7" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>
);
