# Agumino

A Turkish-language family memory app built with React and Vite. Designed as a mobile-first web app, it lets parents create child profiles, upload photos with decorative frames, and build a private family feed — all stored locally in the browser.

## Features

- **Login / Sign-up** — email + password auth UI with Turkish validation rules and an optional invite code
- **Child profiles** — add one or more children; every memory is linked to a child
- **Memory feed** — home screen shows a chronological photo feed with like, comment, and share actions
- **Frame picker** — choose from built-in frames (Agumino 1, Agumino 2, Bebeğim), drag to reposition, and pinch/zoom via a range slider
- **Albums (Paylaşımlar)** — per-child album grid view with a story-ring style highlight row
- **Children screen** — list of child profiles with memory counts
- **Profile & settings** — account info, subscription (PRO), invite code, and logout
- **Notifications** — placeholder screen for likes, comments, and family invites
- **Side drawer** — premium upgrade prompt and legal documents
- **Persistent storage** — children and posts are saved to `localStorage`; photos are compressed to ≤ 1440 px before storage

## Tech Stack

| | |
|---|---|
| Framework | React 18 |
| Bundler | Vite |
| Styling | Plain CSS (`src/styles.css`) |
| Storage | Browser `localStorage` |
| Icons | Inline SVG components |

No external UI libraries or state managers — just React hooks and the browser APIs.

## Getting Started

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. The app renders inside a phone-shaped container so it looks correct on both desktop and mobile browsers.

## Build

```bash
npm run build
```

Static output goes to `dist/`.

## Project Structure

```
src/
  App.jsx      — all screens, sheets, and app logic
  styles.css   — all visual design
  main.jsx     — React entry point
public/
  logo.png.png
  agumino1.png / agumino2.png / bebegim3.png  — photo frames
  noalbum.png / nochildsaved.png / zemin.png  — empty state illustrations
```

## Language

The entire UI is in Turkish.
