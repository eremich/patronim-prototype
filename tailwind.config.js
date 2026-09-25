import { color, elevation, font, motion, radius, type } from './src/design-system/tokens.js';

/** Utility classes are generated from src/design-system/tokens.js — no raw values here. */
const v = (group) => Object.fromEntries(Object.entries(group).map(([k, t]) => [k, t.value]));
const px = (n) => `${n}px`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,mdx}', './.storybook/**/*.{ts,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ink: color.ink.value,
      navy: { DEFAULT: color.navy.value, deep: color['navy-deep'].value, soft: color['navy-soft'].value },
      surface: color.surface.value,
      canvas: color.canvas.value,
      line: color.line.value,
      muted: color.muted.value,
      ok: { DEFAULT: color.ok.value, ink: color['ok-ink'].value },
      risk: { DEFAULT: color.risk.value, ink: color['risk-ink'].value },
      late: { DEFAULT: color.late.value, ink: color['late-ink'].value },
      scrim: color.scrim.value,
      desk: color.desk.value,
    },
    fontFamily: { sans: [font.family] },
    fontSize: Object.fromEntries(
      Object.entries(type).map(([k, t]) => [k, [px(t.size), { lineHeight: px(t.line), letterSpacing: t.tracking }]]),
    ),
    fontWeight: Object.fromEntries(Object.entries(font.weights).map(([k, n]) => [k, String(n)])),
    borderRadius: {
      none: '0',
      ...Object.fromEntries(Object.entries(radius).map(([k, t]) => [k, px(t.value)])),
      phone: '48px',
    },
    extend: {
      screens: { phone: '480px' },
      boxShadow: { ...v(elevation), phone: `0 40px 80px rgba(19, 26, 58, 0.18), 0 0 0 10px ${color.ink.value}` },
      spacing: { 13: '52px', 18: '72px', 22: '88px' },
      zIndex: { sticky: '20', tabbar: '30', backdrop: '40', sheet: '50', toast: '60' },
      transitionTimingFunction: { out: motion['ease-out'].value, drawer: motion['ease-drawer'].value },
    },
  },
  plugins: [],
};
