# Kids Maze

Fun, colorful progressive maze game for young kids (through ~age 7). Touch-first for tablets (iPad portrait/landscape), with keyboard support on desktop.

## Features

- **15 levels** — easy (wide & short) → medium → harder (longer, more dead ends)
- Seeded deterministic mazes that are always solvable
- Finger drag along the path **or** tap adjacent cells
- Arrow keys / WASD on desktop
- Hint button pulses the next turn (not the full solution)
- Level select with unlock progress saved in `localStorage`
- Win celebration + big **Next Level** button
- PWA-friendly viewport (no zoom glitches), no ads/accounts/tracking
- Sound off by default (no sound in v1)

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
