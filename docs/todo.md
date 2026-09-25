# Task Plan

Style: impeccable (brief tokens are the contract)

## Current Task — Patronim redesign clickable prototype (brief: `patronim-prototype-brief.md`)

### Decisions (brief ambiguities)
- Fixed mock clock: Thu 1 Oct 2026, 11:40, holiday week (Thu–Sat). Makes screenshots deterministic.
- `ok` / `risk` fail AA as text → added `ok-ink` / `risk-ink` for text; brief colors used for fills, bars, icons.
- Price is computed (base + extras, holiday +20%, < 24 h +15%); "₪384" in brief is an example.
- Mock interior photos are hand-drawn SVG placeholders in `public/mock/`.
- Offline banner: patron, `at-risk` scenario + toggle in Profile.
- Skeleton 600 ms on first visit to Today / Jobs.

### Steps
- [x] 1. Tokens + base components
- [x] 2. Manager flow
- [x] 3. Patron flow
- [x] 4. Inspector flow
- [x] 5. Cross-role state wiring + URL scenarios
- [x] 6. States: empty, loading, error, at risk, offline
- [x] 7. `npm run shots` (15 PNGs)
- [x] 8. Self-review against brief §10, fix gaps

## Review

- Stack: Vite + React + TS, Tailwind v3 built from `src/design-system/tokens.js`, React Router, Zustand, Lucide, Playwright.
- Design system lives in Storybook (source of truth, same pattern as PMS3fivetwo): Introduction, Guidelines, Foundations (tokens with live contrast), one page per component, MDX for Turnover window bar. `npm run storybook`; published at `/storybook` by `npm run build`.
- End-to-end story (brief 5.4) verified by clicking: book → start → rooms + photos → missing towel → submit → mirror needs redo → fixed → resubmit → mark as ready → manager rates.
- Mock clock moves with the story (clean ≈ planned duration, inspection 10–15 min) so the "now" marker travels along the window.
- `npm run shots` starts its own server and writes all 15 PNGs (1170 × 2532) to `shots/`. Reviewed all 15 against §10; fixed: "Now" pill colliding with checkout time, false red "time left", unseeded deep links, frame scroll leak, plural copy.
- Not done / known: design-reviewer / a11y agents from the kit aren't available as agent types in this session — review was done inline with the impeccable rules. Other seeded jobs don't progress while the clock advances during the live demo (they may drift to "at risk").

## Completed

- Patronim prototype, 25 Sep 2026.
