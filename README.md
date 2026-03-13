# זיכרון — Zikaron Memorial

> *לא אשכח — I will not forget*

Interactive digital memorial for fallen IDF soldiers. A tactical map of Israel with soldier pins, time-travel timeline, and individual memorial profile pages.

## Tech Stack

- **Framework:** Next.js 14 App Router + TypeScript strict
- **Map:** Leaflet.js + react-leaflet + react-leaflet-cluster
- **Styling:** Vanilla CSS + CSS Modules
- **Data:** 150 soldiers (static JSON, Phase 1)
- **Hosting:** AWS Amplify

## Getting Started

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
pnpm type-check # TypeScript check
pnpm test       # Vitest test suite
```

## Deploy

Pushes to `master` (via merged PR) trigger an AWS Amplify deployment automatically via GitHub Actions + OIDC.
