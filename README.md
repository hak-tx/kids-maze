# Kids Maze

Colorful progressive maze game for kids (through ~age 7, with a real challenge from level 1). Touch-first for tablets (iPad Mini portrait/landscape), with keyboard support on desktop.

## Features

- **16 levels** — single-width corridors, zero widen-passes, long farthest-cell solutions
- Early boards start at **15×15** (not tiny 7×7 open rooms)
- Late boards grow to **25×25**, still readable on an iPad Mini
- Seeded deterministic mazes that are always solvable
- Distinct themed walls/floors, animated explorer, waving flag + star portal
- Finger drag along the path **or** tap adjacent cells
- Arrow keys / WASD on desktop
- Hint button pulses the next turn (not the full solution)
- Level select with unlock progress saved in `localStorage` (`kids-maze-progress-v2`)
- Win celebration + big **Next Level** button
- Optional soft sounds, **muted by default**
- PWA-friendly viewport (no zoom glitches), no ads/accounts/tracking

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Local dev server with HMR |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Serve the production build locally |

## Deploy (e.g. Vercel)

This repo includes `vercel.json` with an SPA fallback rewrite. Connect the GitHub repo to Vercel; build command `npm run build`, output `dist`.

## Stack

Vite + React + TypeScript. No heavy UI libraries.
