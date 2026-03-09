# 🗺️ UX WIREFRAMES — Zikaron Memorial App

## MAIN VIEW (index.html) — Desktop 1440px

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ✡ ZIKARON  |  זיכרון  |  [🔍 Search soldier...]    | HEB / ENG  | ● 1,152 Fallen│
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ HEADER ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
├───────────────────┬──────────────────────────────────────────┬────────────────────┤
│                   │                                          │                    │
│  ◈ LEFT PANEL     │         ◈ MAP CANVAS (MAIN)             │  ◈ RIGHT STATS     │
│  ─────────────    │  ┌───HUD FRAME BORDER────────────────┐  │  ─────────────     │
│                   │  │                                   │  │                    │
│  Oct 8, 2023      │  │        [Israel Map]               │  │  Day: 523          │
│  ─────────────    │  │                                   │  │  Fallen: 1,152     │
│                   │  │    📍 📍    📍                    │  │  Cities: 224       │
│  ▸ יוסף כהן       │  │        📍                         │  │  Units: 18         │
│    ╟◦ Corporal    │  │  📍                                │  │                    │
│    ╟◦ Oct 8       │  │         [📍 ← Pin cluster]        │  │  ─────────────     │
│    ╟◦ Be'eri      │  │         📍  📍  📍                │  │  FILTERS:          │
│                   │  │                                   │  │  ☑ Ground Force    │
│  ─────────────    │  │  📍  📍                           │  │  ☑ Navy            │
│                   │  │                                   │  │  ☑ Air Force       │
│  ▸ דוד לוי        │  │              📍 📍                │  │  ☑ Special Ops     │
│    ╟◦ Major       │  │                                   │  │                    │
│    ╟◦ Oct 15      │  │                                   │  │  ─────────────     │
│    ╟◦ Gaza City   │  └───────────────────────────────────┘  │  [🕯 Light Candle] │
│                   │       ↑ Lat: 31.77 | Lon: 35.21 ↑       │                    │
│  ... (scrollable) │                                          │                    │
├───────────────────┴──────────────────────────────────────────┴────────────────────┤
│  ◈ TIMELINE SCRUBBER                                                              │
│  ─────────────────────────────────────────────────────────────────────────────── │
│  ▶PLAY  |Oct 7|──────────────────◇────────────────────────────────────────|TODAY  │
│          2023  Nov   Dec   Jan   Feb   Mar   Apr  ...  2024  ...  2025  ...  2026 │
│                      Day 47 · Nov 23, 2023 · 312 Heroes Fallen                   │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

## PIN POPUP (on map pin click)

```
   ┌──────────────────────────────────┐
   │  [Photo]  יוסף כהן               │  ← Amber border, glassmorphic
   │  ─────    Yosef Cohen            │
   │           ─────────────────────  │
   │  📋 Corporal · Golani Brigade    │
   │  📅 October 8, 2023              │
   │  📍 Kibbutz Be'eri               │
   │  🏠 Haifa                        │
   │  ─────────────────────────────── │
   │  [🕯 Light Candle] [Full Profile →] │
   └──────────────────────────────────┘
```

---

## SOLDIER PROFILE PAGE (soldier.html)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ✡ ZIKARON  [← Back to Map]                                                     │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   ┌─────────────┐   יוסף כהן                                                    │
│   │             │   Yosef Cohen                                                  │
│   │   [PHOTO]   │   ─────────────────────────────────────────────────────────── │
│   │             │   Corporal · Golani Brigade · IDF                             │
│   └─────────────┘   Born: March 14, 1999  |  Fell: October 8, 2023 (age 24)    │
│                     Kibbutz Be'eri, Southern District                            │
│                                                                                  │
│  ─────────────────────────────────── BIOGRAPHY ──────────────────────────────── │
│                                                                                  │
│  Yosef was born in Haifa and enlisted in the Golani Brigade at age 18...        │
│                                                                                  │
│  ─────────────────────────────────── TRIBUTE ────────────────────────────────── │
│                                                                                  │
│   [🕯] [🕯] [🕯]   🕯 Light a Candle in Memory   3,421 candles lit             │
│                                                                                  │
│  ─────────────────────────────────── MAP ────────────────────────────────────── │
│                                                                                  │
│   [ Small map showing the location where he fell ]                               │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## MOBILE VIEW (375px)

```
┌────────────────────┐
│ ✡ ZIKARON  [≡]     │  ← Hamburger menu
├────────────────────┤
│                    │
│   [Israel Map]     │
│                    │
│  📍  📍   📍      │
│      📍            │
│  📍       📍      │
│                    │
├────────────────────┤
│ ╠══════◇═════════╣ │  ← Timeline (compact)
│ ▶ Nov 23, 2023     │
├────────────────────┤
│ ─── 3 SOLDIERS ─── │
│ יוסף כהן  Oct 8    │
│ דוד לוי   Oct 15   │
│ ...                │
└────────────────────┘
```

---

## ANIMATION STORYBOARD

```
T=0s  Page loads → black screen
T=0.3s  Title fades in with golden glow
T=0.8s  Tactical grid draws itself in (line by line)
T=1.2s  Israel map boundary traces (like a drawing coming to life)
T=1.8s  First pin drops with ripple → "Oct 7, 2023"
T=2.0s  Timeline appears from bottom
T=2.2s  Left panel slides in from left
T=2.5s  Counter in header animates up to current total
T=3.0s  Idle state — pins pulse gently like heartbeats
```

---

## INTERACTION FLOW MAP

```
        [Landing]
            │
     ┌──────┴──────┐
     ▼             ▼
[Browse Map]   [Search Bar]
     │             │
     ▼             ▼
[Click Pin]    [Results List]
     │             │
     └──────┬──────┘
            ▼
       [Pin Popup]
            │
            ▼
    [Full Profile Page]
            │
            ▼
    [Light a Candle]
```
