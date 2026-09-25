# Patronim Redesign 2026 — Clickable Prototype Brief

This brief is for Claude Code. Build a clickable MVP prototype of the Patronim redesign. The prototype exists to produce screenshots and a live embed for a portfolio case study. It is not a production app.

---

## 1. Context

**Product.** Patronim is a mobile + web app for a Tel Aviv company that cleans short-term rental apartments (Airbnb hosts and private property managers). Clients order cleanings and amenities (linen, towels, household supplies). Company staff coordinate the work through the app.

**Original (2019).** Designed by Ihor as the sole UI/UX designer at A-Development. It replaced Excel-based operations and served six roles: Client, Property Manager, Administrator, Patron (cleaner), Quality Controller, Dispatcher. It included payments with dynamic pricing and refunds on cancellation.

**Why a redesign.** An audit of the 2019 screens found:

1. **Guest check-in time was optional** ("Set Check-in Time: Unknown"). It is the real deadline of the whole service: the apartment must be ready before the next guest arrives.
2. **Price was hidden until the last step** ("Total" row at the bottom). Dynamic pricing (season, holidays, demand, late booking) was invisible and unexplained.
3. **Service types used internal jargon** ("Mid Holiday NoSheets", "Pre-Checkin 2h Refresh") with no description, duration or scope.
4. **The cleaner could not see the time window.** The job card emphasized zip code; checkout and check-in were plain text lines.
5. **Quality control had no evidence.** Inspections were a plain list of addresses; the checklist was flat, with no photos and no way to send one item back for rework.
6. Visual issues: one blue for everything (no hierarchy or states), low-contrast grey text on blue, unlabeled 5-icon tab bar, airplane icons for time fields, copy-paste screen titles, no empty / loading / error states.

**Redesign thesis.** Turn an order-tracking tool into a service that guarantees the apartment is ready before the guest arrives. The **turnover window** (checkout → next check-in) becomes the organizing element across all roles.

---

## 2. Scope

### In scope
- Mobile app prototype, three roles, switchable:
  - **Property Manager** (orders and tracks)
  - **Patron** (cleans)
  - **Quality Controller** (inspects)
- One connected end-to-end scenario across the three roles, driven by shared client-side state.
- Mock data only. No backend, no database, no auth, no real payments.
- Empty, loading, error and "at risk" states for key screens.
- Deterministic scenarios via URL params for screenshots.
- Automated screenshot script.

### Out of scope
- Administrator web panel, Dispatcher, Client roles (they appear in the case study as a service blueprint, not in the prototype).
- Real maps, real chat, push notifications (simulate with static UI and toasts).
- Registration / onboarding flows.

---

## 3. Tech stack

- Vite + React + TypeScript
- Tailwind CSS with the tokens below defined in `tailwind.config` (no hard-coded hex values in components)
- React Router
- Zustand for shared state (one store; a job created by the manager appears for the patron, a failed inspection item appears back for the patron, and the manager sees the status change)
- Lucide icons
- Playwright for screenshots

Keep components in `src/components/` with one file per component, written so they can later be moved into Storybook without changes (props-driven, no store access inside presentational components).

---

## 4. Design direction

### Principle
One bold element, everything else calm: the **turnover window bar**. It shows checkout time on the left, guest check-in on the right, the cleaning block inside, and a "now" marker. It appears on the manager's job tracking, the patron's job card and the inspector's queue. Its color reflects status.

Avoid: one-color-for-everything (the original problem), generic SaaS card kit with identical shadows, gradient washes, all-caps eyebrow labels.

### Color tokens

| Token | Hex | Use |
|---|---|---|
| `ink` | `#131A3A` | Primary text |
| `navy` | `#1B2FA0` | Brand, primary actions (continuity with the original Patronim navy) |
| `navy-soft` | `#E8EBF9` | Selected states, brand tint surfaces |
| `surface` | `#FFFFFF` | Cards, sheets |
| `canvas` | `#F3F5F8` | App background (cool, "fresh linen" white, not cream) |
| `line` | `#DCE1EA` | Dividers, borders |
| `muted` | `#5B6478` | Secondary text (must pass 4.5:1 on `surface` and `canvas`) |
| `ok` | `#0F8A6A` | On track, passed |
| `risk` | `#C9820A` | At risk (window tight) |
| `late` | `#C8363B` | Late, failed item, errors |

Status colors always come with an icon and a text label, never color alone.

### Typography
- **Hanken Grotesk** (Google Fonts) for everything. Fallback: `system-ui, sans-serif`.
- Use tabular numerals (`font-variant-numeric: tabular-nums`) for all times and prices.
- Scale: 28 / 22 / 17 / 15 / 13. Weights 400, 500, 700. Sentence case everywhere.

### Shape and spacing
- 4 px spacing grid. Screen padding 16. Touch targets ≥ 44.
- Radius by hierarchy: sheets 20, cards 14, inputs and buttons 12, chips 999. Not one radius on everything.
- Elevation only on bottom sheets and sticky footers. Cards sit on `canvas` with a `line` border, no shadow.

### Tab bar
Labeled tabs, max 4 per role. Icons + text.

---

## 5. Screens and flows

Viewport: 390 × 844 (iPhone). Render inside a centered phone-sized container on desktop.

A small role switcher sits outside the phone frame (desktop) or behind a long-press on the avatar (mobile). It is not part of the screenshots.

### 5.1 Property Manager

Tabs: **Today · Properties · Bookings · Account**

1. **Today** — upcoming turnovers sorted by guest check-in. Each item shows property, service, turnover window bar, status (Scheduled / Cleaning / Inspection / Ready / At risk). Primary action: "Book a cleaning".
2. **Book a cleaning** (single scrolling screen with sections, sticky price footer):
   - Property (picker with photo, bedrooms, m²)
   - Service (cards with plain names, what's included, duration):
     - Turnover clean — after checkout, before the next guest
     - Quick refresh — 2 hours before check-in
     - Mid-stay clean with fresh linen
     - Mid-stay clean, no linen change
     - Linen delivery only
     - Owner clean
   - Timing: guest checkout time and **guest check-in time (required)**. The turnover window bar previews live. If the window is shorter than the service duration, show a `risk` message with the earliest safe option.
   - Extras: linen sets, towels, amenity kit (steppers)
   - Note for the cleaner
   - **Sticky footer**: total price, updating live, tap to expand the breakdown.
3. **Price breakdown sheet** — base price, extras, and dynamic adjustments explained in plain words, e.g. "Holiday week +20%", "Booked less than 24 h ahead +15%". Show a hint when a cheaper time exists ("Book for Sunday morning to save ₪48").
4. **Review and pay** — summary, payment method (saved card, PayPal, invoice), cancellation policy in one line ("Free cancellation until 24 h before start. After that, 50% refund."). Button: "Pay ₪384".
5. **Booking confirmed** — what happens next, as a 4-step timeline: Cleaner assigned → Cleaning → Inspection → Ready for guest.
6. **Job tracking** — turnover window bar with "now" marker and projected finish, room-by-room progress with "after" photos as they arrive, assigned cleaner, message button. Status updates when the patron and inspector act.
7. **Rate the job** — after "Ready", 1–5 rating plus optional comment.

### 5.2 Patron (cleaner)

Tabs: **Jobs · Messages · Earnings · Profile**

1. **Jobs** — today's jobs ordered by deadline. The job card leads with the time window and time left ("Guest arrives in 3 h 10 min"), then address and apartment size. Zip code is secondary. Segments: Today / Upcoming / Done.
2. **Job detail** — address, access notes, the manager's note, extras to bring, turnover window bar. Button: "Start cleaning".
3. **Room checklist** — rooms as sections (Bedroom, Bathroom, Kitchen, Living room). Each room has 4–6 checklist items and a required "after" photo (use mock images). Progress at the top: "3 of 4 rooms done".
4. **Report missing item** — bottom sheet: item type, quantity, optional photo. Creates a record visible to the manager.
5. **Submit for inspection** — enabled when all rooms have photos. Confirmation toast: "Sent for inspection".
6. **Rework** — when the inspector sends an item back, the job returns to the top of Jobs with a `late`-colored "1 item to redo" label, showing the inspector's note and photo.
7. **Earnings** — this month's earnings, hours, average time per apartment. Simple, no charts required.

### 5.3 Quality Controller

Tabs: **Queue · Map · History · Profile** (Map is a static image with pins)

1. **Inspection queue** — ordered by guest check-in, each item with turnover window bar and status.
2. **Inspection** — per room: the patron's photos and the checklist. Each item: Pass / Needs redo. "Needs redo" opens a sheet for a note and optional photo.
3. **Outcome**:
   - All passed → "Mark as ready" → manager status becomes Ready.
   - Any item needs redo → "Send back to cleaner" → patron sees Rework, manager sees "Rework in progress".

### 5.4 End-to-end scenario (must work by clicking)

Manager books a turnover clean → Patron starts, completes rooms with photos, reports a missing towel → submits → Inspector marks "Bathroom: mirror streaks" as needs redo → Patron fixes and resubmits → Inspector marks ready → Manager sees Ready and rates the job.

---

## 6. States to include

- Empty: manager with no bookings ("No cleanings booked. Book one for your next checkout."), patron with no jobs today.
- Loading: skeletons on Today and Jobs (simulate 600 ms).
- Error: payment declined ("Your card was declined. Try another card or pay by invoice.").
- At risk: window shorter than service duration; job running behind (projected finish after check-in).
- Offline banner for the patron (static).

---

## 7. Mock data

Location: Tel Aviv. Currency: ₪ (ILS). Prices are illustrative.

Properties:
- 77 Ben Yehuda St, Apt 4 — 2 bedrooms, 70 m²
- 164 Hayarkon St, Apt 12 — 1 bedroom, 48 m²
- 3 Bograshov St, Apt 1 — 3 bedrooms, 100 m²
- 37 Levinski St, Apt 7 — studio, 32 m²
- 3 Weizmann St, Apt 1 — 1 bedroom, 55 m²

People: manager Dana Levi, patron Avi Mizrahi, inspector Noa Shapiro.

Pricing examples: Turnover clean 2BR ₪290 base, linen set ₪45, holiday week +20%, booked < 24 h +15%.

Use royalty-free placeholder interior photos stored locally in `public/mock/` (generate simple placeholder images if none are available; do not hotlink).

---

## 8. Copy rules

- English, sentence case, active voice, plain words.
- A button says what happens: "Book cleaning", "Start cleaning", "Send back to cleaner", "Mark as ready".
- The same action keeps its name through the flow (button "Mark as ready" → toast "Marked as ready").
- Errors say what happened and how to fix it. No apologies.
- No internal jargon in client-facing text.

---

## 9. Scenarios via URL (for deterministic screenshots)

Support `?role=manager|patron|inspector&scenario=<name>` to preload state:

- `default` — the normal mid-day state
- `empty`
- `at-risk`
- `rework`
- `payment-error`
- `ready`

---

## 10. Screenshot automation

Add `npm run shots` (Playwright, Chromium, viewport 390 × 844, `deviceScaleFactor: 3`, reduced motion on). Save PNGs to `shots/` with these names:

1. `01-manager-today.png`
2. `02-manager-book.png` (timing section visible, window bar in view)
3. `03-manager-book-at-risk.png`
4. `04-manager-price-breakdown.png`
5. `05-manager-confirmed.png`
6. `06-manager-tracking.png`
7. `07-patron-jobs.png`
8. `08-patron-checklist.png`
9. `09-patron-missing-item.png`
10. `10-patron-rework.png`
11. `11-inspector-queue.png`
12. `12-inspector-needs-redo.png`
13. `13-manager-ready-rate.png`
14. `14-manager-empty.png`
15. `15-payment-error.png`

Screenshots capture the phone screen only (no role switcher, no desktop background).

---

## 11. Acceptance criteria

- The end-to-end scenario in 5.4 works purely by clicking, starting from a fresh load.
- All colors, radii and spacing come from tokens.
- Contrast meets WCAG AA for text; status is never communicated by color alone.
- Every screen listed in section 5 exists and is reachable.
- `npm run shots` produces all 15 files without manual steps.
- Deployable as a static site (e.g. Vercel) so it can be embedded in the case study.

---

## 12. Working order

1. Tokens + base components (Button, Card, Chip, TurnoverWindowBar, StatusBadge, ListItem, Sheet, Stepper, TabBar).
2. Manager flow.
3. Patron flow.
4. Inspector flow.
5. Cross-role state wiring and scenarios.
6. States (empty, loading, error, at risk).
7. Screenshot script.
8. Self-review: take screenshots, compare against this brief, fix gaps.
