/**
 * Patronim design tokens — the single source of truth.
 * tailwind.config.js builds the utility classes from this file,
 * and the Storybook Foundations pages render it directly, so docs and code cannot drift.
 * Each token: value + what it is for.
 */

/**
 * Semantic colors, one value per theme. Names stay the same in both themes,
 * so components never branch on light or dark: the CSS variables flip.
 * Dark theme: brand-tinted navy night (not black); primary actions turn light navy with dark text.
 */
export const color = {
  ink: { light: '#131A3A', dark: '#E9ECF6', use: 'Primary text' },
  navy: { light: '#1B2FA0', dark: '#94A3F5', use: 'Brand, primary actions, links. Continuity with the 2019 Patronim navy' },
  'navy-deep': { light: '#14237A', dark: '#B0BCF8', use: 'Primary action hover and pressed' },
  'navy-soft': { light: '#E8EBF9', dark: '#232C59', use: 'Selected states, brand tint surfaces' },
  surface: { light: '#FFFFFF', dark: '#161B31', use: 'Cards, sheets. Also the text color on filled buttons and badges' },
  canvas: { light: '#F3F5F8', dark: '#0D1122', use: 'App background. Light: cool "fresh linen" white, not cream' },
  line: { light: '#DCE1EA', dark: '#2B3355', use: 'Dividers, borders' },
  muted: { light: '#5B6478', dark: '#A0A8C0', use: 'Secondary text. AA on surface and canvas in both themes' },
  ok: { light: '#0F8A6A', dark: '#1FA37F', use: 'On track, passed. Fills, bars and icons' },
  'ok-ink': { light: '#0B6E54', dark: '#4FCBA3', use: 'On-track text. The light fill is 4.3:1, below AA for text' },
  risk: { light: '#C9820A', dark: '#D9951F', use: 'At risk (window tight). Fills, bars and icons' },
  'risk-ink': { light: '#8A5700', dark: '#EBAE4A', use: 'At-risk text. The light fill is 3.1:1, below AA for text' },
  late: { light: '#C8363B', dark: '#E0555A', use: 'Late, failed item, errors' },
  'late-ink': { light: '#B02E33', dark: '#FF8F92', use: 'Late text on tinted fills' },
  scrim: { light: '#131A3A', dark: '#03050C', use: 'Backdrop behind sheets (used at 40%)' },
  desk: { light: '#E4E8EF', dark: '#070A15', use: 'Desktop background around the phone frame. Not part of the app' },
};

/** Physical phone bezel in the desktop frame. Same in both themes */
export const bezel = '#131A3A';

export const themes = ['light', 'dark'];

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
