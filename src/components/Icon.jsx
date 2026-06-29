export default function Icon({ name, style }) {
  const s = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", style };
  if (name === "home") return <svg viewBox="0 0 24 24" fill="currentColor" style={style}><path d="M3.5 11.2 12 4l8.5 7.2v8.1a1.7 1.7 0 0 1-1.7 1.7h-4.2v-5.7H9.4V21H5.2a1.7 1.7 0 0 1-1.7-1.7v-8.1Z" /></svg>;
  if (name === "photos") return <svg {...s} strokeWidth="2.2"><path d="M5 7.4v10.8a1.8 1.8 0 0 0 1.8 1.8h10.8" /><rect x="8" y="4" width="11.5" height="11.5" rx="2" /><path d="m9.8 14 3.1-3.5 2.2 2.5 1.4-1.6 3 3.4" /><circle cx="12.2" cy="7.7" r=".8" fill="currentColor" stroke="none" /></svg>;
  if (name === "kid") return <svg {...s} strokeWidth="2.1"><circle cx="12" cy="12" r="5.8" /><circle cx="5.8" cy="12" r="1.8" /><circle cx="18.2" cy="12" r="1.8" /><path d="M9.6 11h.01M14.4 11h.01M9.8 14.4c1.3 1 3.1 1 4.4 0" /></svg>;
  if (name === "profile") return <svg {...s} strokeWidth="2.2"><circle cx="12" cy="8.2" r="3.4" /><path d="M5.4 20c.8-3.8 3.3-5.7 6.6-5.7s5.8 1.9 6.6 5.7" /></svg>;
  if (name === "heart") return <svg {...s} strokeWidth="2.2"><path d="M20.8 4.6c-1.7-1.6-4.4-1.6-6.1.1L12 7.4 9.3 4.7C7.6 3 4.9 3 3.2 4.6c-1.8 1.8-1.7 4.7.1 6.5L12 20l8.7-8.9c1.8-1.8 1.9-4.7.1-6.5Z" /></svg>;
  if (name === "plus") return <svg {...s} strokeWidth="2.4"><path d="M12 5v14M5 12h14" /></svg>;
  if (name === "mail") return <svg {...s} strokeWidth="2.2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
  if (name === "calendar") return <svg {...s} strokeWidth="2.2"><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /></svg>;
  if (name === "lock") return <svg {...s} strokeWidth="2.2"><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><path d="M12 15v2" /></svg>;
  if (name === "eye") return <svg {...s} strokeWidth="2.2"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>;
  if (name === "eye-off") return <svg {...s} strokeWidth="2.2"><path d="M17.9 17.9A10 10 0 0 1 12 20C5.5 20 2 12 2 12a17.7 17.7 0 0 1 5.1-6.1M9.9 5.2A9.6 9.6 0 0 1 12 5c6.5 0 10 7 10 7a17.8 17.8 0 0 1-2.3 3.4" /><path d="M14.1 14.1A3 3 0 0 1 9.9 9.9" /><path d="m3 3 18 18" /></svg>;
  if (name === "back") return <svg {...s} strokeWidth="2.4"><path d="M15 18l-6-6 6-6" /></svg>;
  if (name === "menu") return <svg {...s} strokeWidth="2.4"><path d="M4 6h16M4 12h16M4 18h16" /></svg>;
  if (name === "user") return <svg viewBox="0 0 24 24" fill="currentColor" style={style}><path d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0ZM5 21a7 7 0 0 1 14 0H5Z" /></svg>;
  if (name === "camera") return <svg viewBox="0 0 24 24" fill="currentColor" style={style}><path d="M12 15.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM20 7h-2.7l-1.2-2H7.9L6.7 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" /></svg>;
  if (name === "logout") return <svg {...s} strokeWidth="2.2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
  if (name === "bell") return <svg {...s} strokeWidth="1.5"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
  if (name === "dots") return <svg viewBox="0 0 24 24" fill="currentColor" style={style}><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></svg>;
  if (name === "shield") return <svg {...s} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>;
  if (name === "doc") return <svg {...s} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>;
  if (name === "alert-circle") return <svg {...s} strokeWidth="2.2"><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></svg>;
  return null;
}
