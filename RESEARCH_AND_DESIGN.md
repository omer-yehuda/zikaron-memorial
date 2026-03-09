# 🇮🇱 Israeli Military Memorial — Research & Design Document
**Project Name:** זיכרון (Zikaron — Memory)  
**Document Type:** UI/UX Research + Design Specification  
**Prepared by:** Antigravity AI Design Research  
**Date:** March 2026  

---

## 1. PROJECT VISION

A digital memorial for fallen Israeli soldiers — displaying WHERE and WHEN they fell,
on an interactive, tactical-aesthetic map of Israel with a time-travel timeline.
This is not just a database. It's a living, breathing monument.

### Core Mission Statement
> "To transform raw data of sacrifice into a spatial, emotional, and deeply human experience —
> allowing any visitor to stand at the point on the map where a hero fell, and travel time to the moment."

---

## 2. RESEARCH FINDINGS — EXISTING MEMORIAL SITES

### 2.1 Official Israeli Sites
| Site | Description | Design Notes |
|------|-------------|--------------|
| **izkor.gov.il** | Israel MOD official memorial DB | Clean but dated; no interactive map; focuses on individual profiles; Hebrew RTL; family-editable |
| **mod.gov.il** | Ministry of Defense memorial section | Formal, government aesthetic; heavy text |
| **israelsfallen.com** | English-language memorial | Profile-based; includes virtual candle lighting; basic layout |

**Key insight from Izkor.gov.il:** The site explicitly aims to evoke "the atmosphere of a military cemetery, a historical museum, and a hall of values." This is the emotional north star.

### 2.2 International Benchmarks
| Site | Strengths to Apply |
|------|-------------------|
| **Villanova "Honoring the Fallen" Map** | Pins with branch/location/year; click → profile. Direct inspiration for our pin model |
| **"Rutland Remembers" (WWI)** | Timeline slider → map updates → biographical link. EXACTLY the time-travel feature we need |
| **ABMC Interactive Timeline (WWII)** | Timeline synced with geography. Inspiring chronological exploration |
| **Pentagon Memorial** | Dignified spatial layout; each unit = a person |

### 2.3 Key Design Gaps in Existing Sites
- No existing Israeli site has an interactive **geographic map** with soldier pins
- No existing site combines a **timeline scrubber** with a live-updating map
- Existing sites feel like **databases**, not like **memorials**
- No site uses the **tactical/military aesthetic** that honors the soldiers' profession

---

## 3. UI/UX DESIGN PRINCIPLES

### 3.1 Emotional Design Goals
1. **Reverence First** — Every design decision must pass the "cemetery test": would this feel appropriate at a grave?
2. **Discovery Without Friction** — Users should organically find soldiers; search + map + timeline all lead to the same profiles
3. **Living Monument** — Not static. Pins appear, candles can be lit, names echo

### 3.2 User Personas
| Persona | Goal | Priority Features |
|---------|------|------------------|
| **Bereaved Family Member** | Find their loved one, share their story | Search bar, individual profile page, candle/tribute |
| **Student / Researcher** | Understand the scope, context, chronology | Timeline, filters, statistics counter |
| **General Public (Israeli)** | Remember, grieve with dignity, understand sacrifice | Full map view, emotional landing, audio moment of silence |
| **International Visitor** | Understand Israel's sacrifice | English toggle, clear visual storytelling through the map |

### 3.3 Information Architecture

```
HOME (Map View — default)
├── MAP (center canvas)
│   ├── Israel SVG/tile map with tactical grid overlay
│   ├── Soldier pins (clustered when zoomed out)
│   └── Click pin → popup → link to profile
├── TIMELINE (bottom bar)
│   ├── Horizontal scrubber: Oct 7 2023 → present
│   ├── Scrubbing updates visible pins on map
│   └── Playback "time-travel" auto-mode button
├── LEFT PANEL (soldier list)
│   ├── Filtered by current timeline position
│   ├── Name, rank, date, city
│   └── Click → scroll map to pin & open popup
├── TOP HEADER
│   ├── Project title (Hebrew + English)
│   ├── Star of David emblem
│   ├── Total fallen counter (animates)
│   └── Search bar
└── SOLDIER PROFILE PAGE (per soldier)
    ├── Full name (Hebrew + English)
    ├── Photo (placeholder if unavailable)
    ├── Date of birth → Date of fall
    ├── Unit / Rank
    ├── Location fallen
    ├── Brief biography
    └── Virtual candle / tribute button
```

---

## 4. VISUAL DESIGN SYSTEM

### 4.1 Design Language: "Tactical Memorial"
A fusion of:
- **Military HUD / tactical ops center** → respect for the soldiers' profession
- **Sacred memorial / stone and light** → reverence for the sacrifice
- **Modern glassmorphism** → accessibility and contemporary legibility

### 4.2 Color Palette

```
PRIMARY BACKGROUND:   #0a0a0f  (near-black, space-like — the weight of loss)
SECONDARY BG:         #0f1117  (card backgrounds)
MAP OVERLAY:          #0d1a3a  (deep navy — tactical)

ACCENT — GOLD/AMBER:  #f4a261  (memorial candle light — warmth, remembrance)
ACCENT — ELECTRIC:    #00b4d8  (tactical map grid lines — precision, duty)
ACCENT — GREEN:       #52b788  (life, Israel's green landscape)
DANGER/ALERT:         #e63946  (pin markers — sacrifice)

TEXT PRIMARY:         #f0f0f0  (white — clarity)
TEXT SECONDARY:       #a8b2c1  (muted steel — supporting info)
TEXT HEBREW:          #ffd700  (gold — honor language)

GLASS PANELS:         rgba(15, 25, 50, 0.6) with backdrop-filter: blur(12px)
PIN COLOR:            #f4a261 with glow: 0 0 12px rgba(244, 162, 97, 0.8)
ACTIVE PIN:           #e63946 with glow: 0 0 20px rgba(230, 57, 70, 0.9)
```

### 4.3 Typography

```css
/* Titles & Hebrew */
font-family: 'Frank Ruhl Libre', serif;  /* Israeli/Hebrew feel, highly legible */

/* English body / UI labels */
font-family: 'Inter', sans-serif;  /* Ultra-modern, military precision */

/* Monospace / coordinates / tactical data */
font-family: 'JetBrains Mono', monospace;  /* HUD readouts */
```

### 4.4 Component Specifications

#### Map Container
- SVG-based Israel map (GeoJSON rendered on canvas)
- Tactical grid overlay (20px grid lines, opacity: 0.1)
- Pentagon-style HUD frame border (clip-path polygon)
- Animated radar sweep (subtle, slow, respectful)

#### Soldier Pin
```
Shape:     Teardrop (Map pin) with Star of David inside
Size:      Default 24px, hover 32px, active 40px
Color:     Amber #f4a261 → glowing effect
Animation: Slow pulse (2s ease-in-out) — like a heartbeat
Cluster:   Number badge when >3 pins overlap
```

#### Timeline Scrubber
```
Position:  Fixed bottom, full width
Height:    80px
Design:    Glassmorphic panel
Track:     Horizontal gradient from start-date to today
Handle:    Gold diamond shape
Ticks:     Major (months), minor (weeks)
Auto-play: "Time Travel" button — animates pins appearing chronologically
```

#### Left Panel — Soldier List
```
Width:     320px
Scroll:    Virtualized list (for performance with 1000+ entries)
Each card: Rank insignia | Name | Date | Location
Hover:     Gold left border + slight glow
```

#### Popup on Pin Click
```
Width:     280px
Content:   Photo thumbnail | Name | Rank | Date | Unit | "לפרופיל המלא" (Full Profile) button
Style:     Glassmorphic panel, amber border
```

---

## 5. INTERACTION DESIGN

### 5.1 Core Interactions

| Interaction | Behavior |
|-------------|----------|
| **Click map pin** | Popup opens with soldier info; list panel scrolls to that entry |
| **Click list item** | Map flies/pans to that pin; pin pulses; popup opens |
| **Drag timeline** | Pins fade in/out based on date; list updates; counter animates |
| **Click ▶ Play** | Auto-advances timeline, revealing pins chronologically (time-travel mode) |
| **Search soldier** | Results appear in list; map highlights matching pins |
| **Hover pin** | Name tooltip appears; pin glows brighter |
| **Zoom map** | Clustered pins break apart into individuals |

### 5.2 Micro-Animations
- **Pin appear:** Scale from 0 → 1 with a ripple effect (200ms ease-out)
- **Pin hover:** Glow intensifies; slight scale-up
- **Timeline scrub:** Smooth easing on pin transitions
- **Counter:** Number counts up on page load (like odometer)
- **Page load:** Tactical grid draws itself in; then pins "drop" one by one
- **Candle:** Flickers gently on individual soldier pages

### 5.3 Time Travel Feature (Key Differentiator)
The user can drag a timeline from **October 7, 2023** forward to today.
As they drag:
1. Pins appear on the map at the correct geographic location
2. A counter in the header updates (e.g., "Day 47 — 312 Fallen")
3. The soldier list updates showing only soldiers fallen up to that date
4. An automatic playback mode narrates the accumulation of loss

---

## 6. DATA ARCHITECTURE

### 6.1 Soldier Data Model
```json
{
  "id": "IDF-001",
  "name_he": "יוסף כהן",
  "name_en": "Yosef Cohen",
  "rank_he": "סמל",
  "rank_en": "Corporal",
  "unit": "Golani Brigade",
  "date_of_birth": "1999-03-14",
  "date_of_fall": "2023-10-08",
  "location_name": "Kibbutz Be'eri",
  "coordinates": { "lat": 31.3858, "lng": 34.5062 },
  "city_of_origin": "Haifa",
  "photo_url": "assets/photos/idf-001.jpg",
  "bio": "Short biography...",
  "profile_url": "/soldiers/idf-001",
  "source": "izkor.gov.il"
}
```

### 6.2 Data Sources & Strategy
- **Primary Source:** izkor.gov.il (Israel MOD official list)
- **Supplementary:** Times of Israel fallen soldiers tracker
- **For prototype:** 30–50 representative sample soldiers with real names/dates/locations from public records
- **Coordinates:** Based on city/area of incident (from public reporting)
- **Future:** JSON file → can upgrade to REST API / Firebase

### 6.3 Sample Representative Data (Prototype)
Sourced from public reporting on Operation Swords of Iron (Oct 2023 – present):
- ~224 cities represented in casualties
- Falls across Gaza border (south), Judea & Samaria (west bank), Lebanon border (north)
- Timeline from Oct 7, 2023 through March 2026
- Additional historical data: Yom Kippur War, Second Lebanon War, Operation Cast Lead can be added as future phases

---

## 7. TECHNOLOGY STACK

### 7.1 Core Technologies
```
HTML5 / CSS3 / Vanilla JavaScript   → No framework needed; max performance
Leaflet.js (v1.9.x)                 → Interactive map, pins, popups, clustering
leaflet.markercluster               → Cluster overlapping pins
OpenStreetMap tiles (free)           → OR Stadia Maps dark theme (no API key needed)
GeoJSON                             → Israel border polygon
Google Fonts                        → Frank Ruhl Libre, Inter, JetBrains Mono
Custom CSS animations               → Tactical aesthetics, pin pulses
```

### 7.2 No API Keys Needed
- Use **Stadia Maps "Alidade Smooth Dark"** tile style (free, no key for dev)
- Or: Embed a custom SVG of Israel (fully offline, no network dependency)
- Or: CARTO dark tiles (free for low traffic)

### 7.3 Performance Targets
- Initial load: < 2 seconds
- 1000 pins rendered: < 100ms (with clustering)
- Timeline scrub response: < 16ms (60fps)
- Mobile responsive: Yes (responsive layout)

---

## 8. ACCESSIBILITY & SENSITIVITY

### 8.1 Emotional Sensitivity Guidelines
- No auto-playing audio without user consent
- No graphic imagery of violence or death
- Respectful language: "נפל" (fell/fallen) not "נהרג" (was killed)
- Family profiles should feel like honoring, not sensationalizing
- Option to light a virtual candle — common Israeli memorial tradition

### 8.2 Technical Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation for map pins and timeline
- Screen reader compatible popups
- High contrast mode option
- RTL support for Hebrew text throughout

### 8.3 Hebrew/English Bilingual Design
- Hebrew as primary language (right-to-left)
- English toggle available
- All data stored in both languages where possible
- Hebrew numerics for dates where applicable

---

## 9. PAGE STRUCTURE (FILES TO CREATE)

```
memorial/
├── index.html              ← Main map application (landing page)
├── soldier.html            ← Individual soldier profile template
├── css/
│   ├── style.css           ← Global styles, design tokens, layout
│   ├── map.css             ← Map-specific styles, pins, popups
│   └── timeline.css        ← Timeline scrubber styles
├── js/
│   ├── data.js             ← Soldier dataset (JSON array)
│   ├── map.js              ← Leaflet map initialization, pins, clusters
│   ├── timeline.js         ← Timeline scrubber, time-travel logic
│   ├── panel.js            ← Left panel list, search, filtering
│   └── main.js             ← App initialization, event coordination
├── assets/
│   ├── icons/
│   │   ├── star-of-david.svg
│   │   └── idf-rank-*.svg
│   └── photos/             ← Soldier profile photos
└── RESEARCH_AND_DESIGN.md  ← This document
```

---

## 10. DEVELOPMENT PHASES

### Phase 1 — MVP (This Session)
- [x] Research & design documentation (this file)
- [ ] Build `index.html` with full dark tactical layout
- [ ] Implement interactive map with Israel boundary
- [ ] Add 30 sample soldier data points
- [ ] Working pins with popups
- [ ] Timeline scrubber (basic drag)
- [ ] Left panel list

### Phase 2 — Enhanced
- [ ] Time-travel auto-play animation
- [ ] Soldier profile template page
- [ ] Virtual candle feature
- [ ] Search functionality
- [ ] Pin clustering for dense areas

### Phase 3 — Production
- [ ] Full data entry (1,152+ soldiers from official sources)
- [ ] Backend API / CMS
- [ ] Hebrew RTL full implementation
- [ ] Family contribution system
- [ ] Mobile app consideration

---

## 11. DESIGN INSPIRATION REFERENCES

| Reference | What to Borrow |
|-----------|---------------|
| War Memorial Wall (Vietnam) | Dark stone aesthetic, names etched in light |
| Izkor.gov.il | Data structure, respect language, candle tradition |
| Rutland Remembers (UK WWI) | Timeline + map sync — the exact UX pattern we need |
| Mass Effect UI | Tactical holographic aesthetic (game HUD) |
| Apple Maps Dark Mode | Clean dark cartography |
| The Wall (Pink Floyd) | Emotional weight of accumulation of loss |

---

## 12. KEY DESIGN DECISIONS & RATIONALE

| Decision | Rationale |
|----------|-----------|
| **Dark background** | Solemnity; also reduces eye strain for emotional browsing; tactical aesthetic |
| **Amber/gold pins** | Candle light = traditional Jewish memorial; gold = honor |
| **Pentagon/HUD border** | Honors the military profession of those commemorated |
| **Timeline at bottom** | Familiar pattern (video scrubber); intuitive for time-travel |
| **Left panel list** | Dual navigation (map + list) serves both explorers and searchers |
| **Hebrew primary** | This is an Israeli memorial; the primary audience is Israeli |
| **No API key required** | Free, privacy-respecting, works offline |
| **Vanilla JS** | Maximum performance, no framework overhead, easier for community contributions |

---

*"לא אשכח" — I will not forget*
