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
| `npm run build:web` | Alias for `npm run build` (web assets for Capacitor) |
| `npm run cap:sync` | Build web + sync into native Capacitor projects |
| `npm run ios:open` | Open the iOS project in Xcode (`npx cap open ios`) |

## Deploy (e.g. Vercel)

This repo includes `vercel.json` with an SPA fallback rewrite. Connect the GitHub repo to Vercel; build command `npm run build`, output `dist`.

## iOS / App Store later

Today this is a **web / PWA** app (Vite → `dist/`). For **TestFlight / App Store**, Capacitor wraps the same `dist/` build in a native iOS shell — no game rewrite.

Scaffolding already in the repo:

- `@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`
- `capacitor.config.ts` — `appId: com.haktx.kidsmaze`, `appName: Kids Maze`, `webDir: dist`
- native `ios/` Xcode project shell (open/build it on a **Mac with Xcode**)

**Requires Node.js >= 22** for `@capacitor/cli`.

On a Mac with Xcode:

```bash
npm install
npm run cap:sync          # builds dist/ and copies into ios/
npm run ios:open          # opens the project in Xcode
```

If `ios/` is ever missing, recreate it then sync:

```bash
npm run build
npx cap add ios
npx cap sync
npx cap open ios
```

From Xcode: run on a simulator/device, archive, and upload to TestFlight / App Store Connect.

## Stack

Vite + React + TypeScript. Capacitor for optional native iOS. No heavy UI libraries.
