# Agumino Project Study

Agumino is a mobile-focused Turkish family memory application. It allows users to track their children's growth through a timeline of photos and stories, all stored locally in the browser.

## Tech Stack
- **Framework:** React 19
- **Build Tool:** Vite 7
- **Styling:** Custom CSS with a focus on Glassmorphism (see `src/styles.css`).
- **Storage:** Browser `localStorage` (via `src/services/storage.js`).

## Core Architecture

### Navigation
The app uses a custom state-based navigation system instead of a traditional router.
- `screenHistory`: An array in `App.jsx` that tracks the stack of screens.
- `currentScreen`: Computed from the last element of the history.

### Data Management
Data is managed through custom React hooks that synchronize with `localStorage`:
- `useChildren.js`: Manages the list of children names.
- `usePosts.js`: Manages the feed entries, including photo data and metadata.

### Photo Processing
- `src/services/photoService.js`: Automatically compresses uploaded images to a maximum width/height of 1440px to stay within `localStorage` limits and improve performance.

## Key Components & Screens
- **Screens (`src/screens/`):**
  - `HomeScreen.jsx`: Displays the memory feed or empty states if no children/posts exist.
  - `LoginScreen.jsx` / `SignupScreen.jsx`: Auth UI (simulated, as data is local).
  - `ChildrenScreen.jsx`: Lists managed children.
  - `ChildDetailScreen.jsx`: Individual child profile.
  - `SharesScreen.jsx`: Album view of all posts.
- **Components (`src/components/`):**
  - `FramePicker.jsx`: Interactive UI for adjusting photo composition and selecting frames.
  - `PostCard.jsx`: Individual feed items with like/comment UI.

## Project Characteristics
- **Language:** Fully localized in Turkish.
- **Local-First:** No backend is required; all data stays on the user's device.
- **Design:** Uses modern CSS features like variables, `backdrop-filter`, and flexbox stacks.

## Development
- **Dev Server:** `npm run dev`
- **Production Build:** `npm run build`
