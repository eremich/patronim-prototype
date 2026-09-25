/**
 * Patronim design tokens — the single source of truth.
 * tailwind.config.js builds the utility classes from this file,
 * and the Storybook Foundations pages render it directly, so docs and code cannot drift.
 * Each token: value + what it is for.
 */

export const color = {
  ink: { value: '#131A3A', use: 'Primary text' },
  navy: { value: '#1B2FA0', use: 'Brand, primary actions. Continuity with the 2019 Patronim navy' },
  'navy-deep': { value: '#14237A', use: 'Primary action hover and pressed' },
  'navy-soft': { value: '#E8EBF9', use: 'Selected states, brand tint surfaces' },
  surface: { value: '#FFFFFF', use: 'Cards, sheets' },
  canvas: { value: '#F3F5F8', use: 'App background. Cool "fresh linen" white, not cream' },
  line: { value: '#DCE1EA', use: 'Dividers, borders' },
  muted: { value: '#5B6478', use: 'Secondary text. 5.9:1 on surface, 5.4:1 on canvas' },
  ok: { value: '#0F8A6A', use: 'On track, passed. Fills, bars and icons' },
  'ok-ink': { value: '#0B6E54', use: 'On-track text. The fill color is 4.3:1, below AA for text' },
  risk: { value: '#C9820A', use: 'At risk (window tight). Fills, bars and icons' },
  'risk-ink': { value: '#8A5700', use: 'At-risk text. The fill color is 3.1:1, below AA for text' },
  late: { value: '#C8363B', use: 'Late, failed item, errors' },
  'late-ink': { value: '#B02E33', use: 'Late text on tinted fills' },
  scrim: { value: '#131A3A', use: 'Backdrop behind sheets (used at 40%)' },
  desk: { value: '#E4E8EF', use: 'Desktop background around the phone frame. Not part of the app' },
};

export const font = {
  family: '"Hanken Grotesk", system-ui, sans-serif',
  weights: { normal: 400, medium: 500, bold: 700 },
};

/** Type scale 28 / 22 / 17 / 15 / 13, sentence case everywhere */
export const type = {
  display: { size: 28, line: 34, tracking: '-0.02em', use: 'Screen titles, big numbers' },
  title: { size: 22, line: 28, tracking: '-0.01em', use: 'Section and sheet titles, totals' },
  headline: { size: 17, line: 24, tracking: '0', use: 'Card titles, buttons, key times' },
  body: { size: 15, line: 22, tracking: '0', use: 'Body text, list rows' },
  caption: { size: 13, line: 18, tracking: '0', use: 'Meta, labels under values' },
};

/** Radius by hierarchy — not one radius on everything */
export const radius = {
  sheet: { value: 20, use: 'Bottom sheets' },
  card: { value: 14, use: 'Cards, photo tiles' },
  control: { value: 12, use: 'Inputs and buttons' },
  bar: { value: 8, use: 'Turnover window bar track' },
  inner: { value: 6, use: 'Blocks inside the window bar track' },
  chip: { value: 999, use: 'Chips, badges, pills' },
};

/** 4 px grid. Screen padding 16. Touch targets at least 44 */
export const space = {
  grid: 4,
  screen: 16,
  touch: 44,
  steps: [4, 8, 12, 16, 20, 24, 32, 40, 48],
};

/** Elevation only on bottom sheets, sticky footers and toasts. Cards have none */
export const elevation = {
  sheet: { value: '0 -8px 32px rgba(19, 26, 58, 0.14)', use: 'Bottom sheets' },
  footer: { value: '0 -4px 16px rgba(19, 26, 58, 0.08)', use: 'Sticky footers, tab bar' },
  toast: { value: '0 8px 24px rgba(19, 26, 58, 0.24)', use: 'Toasts' },
};

export const motion = {
  'ease-out': { value: 'cubic-bezier(0.23, 1, 0.32, 1)', use: 'Entrances, press feedback' },
  'ease-drawer': { value: 'cubic-bezier(0.32, 0.72, 0, 1)', use: 'Bottom sheets' },
  press: { value: '160ms', use: 'Button scale to 0.97 on press' },
  sheet: { value: '320ms in / 200ms out', use: 'Bottom sheet slide' },
  toast: { value: '240ms', use: 'Toast rise and fade' },
};
