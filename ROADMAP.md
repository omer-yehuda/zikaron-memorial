# 🗺️ ROADMAP — זיכרון (Zikaron) Memorial Project

> *"לא אשכח" — I will not forget*
>
> A living digital monument to Israel's fallen heroes — an interactive tactical map
> with time-travel, soldier pins, and individual memorial profiles.

**Last Updated:** March 2026
**Stack:** Next.js 16 · TypeScript · Leaflet.js · Neon PostgreSQL · Vercel
**Current Phase:** Phase 2 — Development (Phase 1 MVP shipped ✅)

---

## 📍 Where We Are Now

```
[✅ Research]  →  [✅ UX Design]  →  [✅ Architecture]  →  [✅ Phase 1]  →  [ Phase 2 ]  →  ...
```

- [x] UI/UX research & competitor analysis (`RESEARCH_AND_DESIGN.md`)
- [x] Wireframes & interaction design (`UX_WIREFRAMES.md`)
- [x] System architecture decision (Next.js + serverless)
- [x] Data model defined (Soldier TypeScript interface)
- [x] Technology stack finalized

---

## ✅ Phase 1 — MVP: The Map Lives — COMPLETE
> **Goal:** A working, beautiful map of Israel with soldier pins and a timeline.
> **Hosting:** Vercel free tier
> **Data:** Static JSON (150 soldiers)
> **Status:** ✅ Shipped — 158 static pages, production build passing

### 1.1 — Project Initialization ✅
- [x] Next.js 16 App Router with TypeScript strict mode
- [x] pnpm as enforced package manager
- [x] Dependencies: `leaflet`, `react-leaflet`, `react-leaflet-cluster`, `@types/leaflet`
- [x] Google Fonts: Frank Ruhl Libre · Inter · JetBrains Mono
- [x] Global CSS design system (tokens, spacing, typography, animations)

### 1.2 — Data Layer ✅
- [x] `data/soldiers.json` — **150 soldiers** (ground/air/navy/special, 2023–2025)
  - Diverse geographic distribution: Gaza, Lebanon border, West Bank
  - Bilingual fields: Hebrew + English names, ranks, cities
- [x] `lib/types.ts` — TypeScript `Soldier` interface (strict)
- [x] `lib/soldiers.ts` — `getAllSoldiers`, `getSoldierById`, `formatDateHebrew`, date utilities

### 1.3 — Core Layout & Header ✅
- [x] `app/layout.tsx` — root layout: fonts, metadata, dark background, RTL
- [x] `components/ui/Header.tsx` — logo (✡), Hebrew/English title, fallen counter, search
- [x] `components/ui/RightPanel.tsx` — stats panel: day count, fallen, branch filter
- [x] Three-column layout: left panel | map | right stats + timeline

### 1.4 — Interactive Map ✅
- [x] `components/map/MapView.tsx` — Leaflet wrapper with `ssr: false` dynamic import
  - Satellite tile layer (Esri World Imagery) with dark CSS filter overlay
  - Custom SVG amber teardrop pins with Star of David (Magen David)
  - Pulse animation on selected pin (heartbeat, 2.2s)
  - Tactical HUD frame with corner brackets and coordinate readout
  - Map labels overlay (region + city names)
- [x] `react-leaflet-cluster` v4.0 — gold/red cluster bubbles, dark theme

### 1.5 — Timeline Scrubber ✅
- [x] `components/timeline/TimelineBar.tsx` — bottom fixed bar
  - Range: Oct 7, 2023 → Mar 2026 (current)
  - Quarterly tick marks with Hebrew month labels
  - Density heat bar (casualty heatmap per quarter)
  - Speed controls: 1× / 5× / 10×, play/pause/reset
- [x] Timeline ↔ map sync: pins appear by `date_of_fall`
- [x] Timeline ↔ counter sync: fallen counter and panel update live

### 1.6 — Soldier List Panel ✅
- [x] `components/panel/SoldierPanel.tsx` — left side panel (292px), glassmorphic
  - Hebrew name · English name · rank · unit · date · location
  - Hover: amber left border glow
  - Auto-scroll to selected soldier
- [x] Click card → map flies to pin (bidirectional sync)
- [x] Filtered by current timeline date

### 1.7 — Profile Pages (SSG) ✅
- [x] `app/soldiers/[id]/page.tsx` — 150 pre-built SSG pages with `generateStaticParams`
- [x] `generateMetadata` — per-soldier Hebrew `<title>` and OpenGraph (SEO critical)
- [x] `SoldierHero` — large hero section: name, rank, unit, dates, age, city
- [x] `CandleTribute` — virtual candle with localStorage counter
- [x] `ProfileMapClient` — embedded mini-map showing fall location

### 1.8 — Soldiers Listing Page ✅
- [x] `app/soldiers/page.tsx` — searchable, filterable grid of all soldiers
  - Search by name (Hebrew/English), unit, city
  - Branch filter pills (ground / air / navy / special)
  - Sort: newest / oldest / Hebrew alphabetical

### 1.9 — API Routes ✅
- [x] `app/api/candles/route.ts` — GET + POST, 24h IP rate-limit, SHA-256 hashing
- [x] `app/api/soldiers/route.ts` — full-text search + branch/date filter
- [x] `app/api/stats/route.ts` — aggregate stats (total, byBranch, byMonth)

### 1.10 — Deploy ✅
- [x] Production build: 158 static pages, 0 TypeScript errors
- [ ] Push to GitHub → connect Vercel (pending)

---

## 🟡 Phase 2 — Enhanced: Profiles, Candles, Time-Travel
> **Goal:** Full soldier profiles, virtual candle feature, time-travel animation.  
> **Hosting:** Vercel Pro  
> **Data:** Static JSON + Neon DB for candles  
> **Target:** Emotionally complete experience

### 2.1 — Soldier Profile Pages (SSG)
- [ ] `app/soldiers/[id]/page.tsx` — static generation per soldier
  - `generateStaticParams()` → builds all 1000+ pages at deploy time
  - `generateMetadata()` → `<title>יוסף כהן — זיכרון</title>` (SEO critical)
- [ ] `components/profile/SoldierHero.tsx`
  - Large photo, name in Hebrew + English, rank, unit, born → fell
- [ ] `components/profile/ProfileMap.tsx`
  - Mini-map showing the exact location where the soldier fell
- [ ] `components/profile/CandleTribute.tsx` (Phase 2.2 dependency)
- [ ] Back link → returns to map, centered on that soldier's pin

### 2.2 — Virtual Candle API
- [ ] Set up **Neon PostgreSQL** (serverless, free tier)
- [ ] Create `candles` table in DB
- [ ] `app/api/candles/route.ts`
  - `GET ?soldier_id=IDF-001` → returns candle count
  - `POST { soldier_id, message? }` → adds candle, rate-limits by IP hash
- [ ] `CandleTribute.tsx` — animated candle flicker
  - "🕯 Light a Candle" button
  - Shows count: "3,421 candles lit"
  - Optional tribute message input
- [ ] Rate limit: 1 candle per IP per soldier per 24h

### 2.3 — Time-Travel Auto-Play
- [ ] `components/timeline/TimeTravelPlayer.tsx`
  - ▶ Play button animates timeline forward from Oct 7
  - Configurable speed (1x, 5x, 10x)
  - Pins drop one by one with ripple animation
  - Counter animates up as each soldier appears
  - ⏸ Pause / ↩ Reset controls
- [ ] Pin appear animation: scale 0→1 with amber ripple ring (200ms)

### 2.4 — Search Functionality
- [ ] `components/panel/SearchBar.tsx` — header search input
- [ ] `app/api/soldiers/route.ts`
  - Search by name (Hebrew or English), unit, city, date range
  - Returns filtered soldier list
- [ ] Search results highlight matching pins on map
- [ ] Keyboard shortcut: `Ctrl+K` / `⌘K` opens search

### 2.5 — Hebrew/English Language Toggle
- [ ] Language context provider (React Context)
- [ ] All UI strings in both languages
- [ ] RTL layout switch (`dir="rtl"`) for Hebrew mode
- [ ] Persisted in `localStorage`

### 2.6 — Full Data Entry (~1,152 soldiers)
- [ ] Research & compile full list from:
  - izkor.gov.il official Ministry of Defense list
  - Times of Israel fallen soldiers tracker
  - IDF Spokesperson public announcements
- [ ] Geocode each soldier's fall location (lat/lng)
- [ ] Validate and import into `soldiers.json`
- [ ] QA review: names, dates, coordinates

---

## 🟠 Phase 3 — Production: CMS, Families, Admin
> **Goal:** Families can contribute. Content is living. Site is sustainable.  
> **Hosting:** Vercel Pro + Neon Scale  
> **Data:** PostgreSQL + Sanity CMS  
> **Target:** National-grade memorial platform

### 3.1 — Database Migration
- [ ] Migrate `soldiers.json` → Neon PostgreSQL `soldiers` table
- [ ] Migrate to DB-driven ISR: new soldier added → page rebuilds automatically
- [ ] `app/api/soldiers/route.ts` → reads from DB instead of JSON

### 3.2 — Sanity CMS Integration
- [ ] Set up Sanity.io project (free tier)
- [ ] Define Sanity schema for `soldier` document
- [ ] Admin panel at `/studio` for authorized editors
- [ ] CMS fields: name, dates, bio, photo, coordinates, unit
- [ ] On-demand ISR: Sanity webhook → `revalidatePath('/soldiers/[id]')`

### 3.3 — Family Contribution System
- [ ] `app/soldiers/[id]/contribute/page.tsx` — submission form
  - Upload a photo
  - Add or edit biography
  - Add memory / tribute message
- [ ] `family_submissions` table in DB
- [ ] Status flow: `pending` → `admin_review` → `approved` / `rejected`
- [ ] Email notification to family on approval

### 3.4 — Admin Review Panel
- [ ] Clerk.dev authentication (protected `/admin` routes)
- [ ] Review queue for family submissions
- [ ] Approve → content live on profile
- [ ] Bulk data upload (CSV → DB import)

### 3.5 — Mobile App Consideration
- [ ] Evaluate React Native / Expo wrapper
- [ ] Push notifications for Yom HaZikaron (Memorial Day)
- [ ] Offline mode: cached soldier data

---

## 🔴 Phase 4 — Legacy: Historical Conflicts
> **Goal:** Expand beyond Swords of Iron to all of Israel's wars.  
> **Data:** Full historical archive from izkor.gov.il

### 4.1 — Historical Wars Data
- [ ] **1948 War of Independence** (~6,373 fallen)
- [ ] **1967 Six-Day War** (~776 fallen)
- [ ] **1973 Yom Kippur War** (~2,656 fallen)
- [ ] **1982 Lebanon War** (~675 fallen)
- [ ] **2006 Second Lebanon War** (~165 fallen)
- [ ] **Terror Attacks** (ongoing)

### 4.2 — War/Era Filter
- [ ] Timeline expands: 1948 → present
- [ ] Conflict selector: dropdown or tabs
- [ ] Map clusters by war era (color-coded pins)
- [ ] "Historical mode" with period-appropriate map styling

### 4.3 — Educational Layer
- [ ] Battle context overlays on map (historical battle lines)
- [ ] "On this day in history" feature
- [ ] School curriculum integration package
- [ ] API for third-party educational apps

---

## 📊 Milestone Summary

| # | Phase | Key Deliverable | Est. Duration | Status |
|---|-------|----------------|---------------|--------|
| 0 | Research + Architecture | Docs, design system, stack decision | ✅ Done | ✅ |
| 1 | MVP | Map + pins + timeline + 150 soldiers + API routes + SSG profiles | ✅ Done | ✅ |
| 2 | Enhanced | Full dataset (1,000+) + Neon DB + Language toggle + Admin | 2–4 weeks | 🔵 Active |
| 3 | Production | CMS + Families + Admin | 4–6 weeks | 🔲 |
| 4 | Legacy | All Israeli wars 1948→present | Ongoing | 🔲 |

---

## 🧰 Technology Decision Log

| Decision | Choice | Date | Reason |
|----------|--------|------|--------|
| Framework | Next.js 14 App Router | Mar 2026 | SSG for SEO; serverless API; ISR for live data |
| Language | TypeScript | Mar 2026 | Type-safe soldier data model |
| Map Library | Leaflet.js + react-leaflet | Mar 2026 | Free, no API key, excellent clustering |
| Styling | Vanilla CSS + CSS Modules | Mar 2026 | Max control, no framework overhead |
| Map Tiles | Stadia Alidade Dark | Mar 2026 | Free, dark theme, no API key required |
| Database | Neon PostgreSQL (serverless) | Mar 2026 | Scales to zero, Vercel integration |
| CMS | Sanity.io | Mar 2026 | Family-editable, real-time, free tier |
| Auth | Clerk.dev | Mar 2026 | Admin panel, easy Next.js integration |
| Hosting | Vercel | Mar 2026 | Zero-config, free tier, global CDN |
| Photo Storage | Vercel Blob | Mar 2026 | Native integration, CDN-backed |

---

## 📁 Key Project Files

| File | Purpose |
|------|---------|
| `RESEARCH_AND_DESIGN.md` | UI/UX research, design system, color palette |
| `UX_WIREFRAMES.md` | ASCII wireframes, interaction flows, animation storyboard |
| `ROADMAP.md` | This file — development phases and milestones |
| `SYSTEM_ARCHITECTURE.md` | Technical architecture, rendering strategy, DB schema |

---

## 🚦 Definition of Done (Per Phase)

**Phase 1 is done when:**
- A visitor can open the site and see Israel with amber pins on a dark map
- Dragging the timeline makes pins appear/disappear by date
- Clicking a pin shows a soldier popup with name, rank, date
- Deployed to a live URL

**Phase 2 is done when:**
- Every soldier has a dedicated `/soldiers/[id]` page (SSG, SEO-ready)
- A visitor can light a virtual candle that persists across sessions
- Time-travel auto-play works smoothly
- Full dataset of 1,000+ soldiers loaded

**Phase 3 is done when:**
- A family member can submit a photo and it goes through an approval flow
- An editor can add a new soldier in Sanity and the page goes live automatically

---

*Built with respect, built with code, built to remember.*  
*בנוי עם כבוד, בנוי עם קוד, בנוי לזכור.*
