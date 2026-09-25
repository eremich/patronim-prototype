import plugin from 'tailwindcss/plugin';
import { bezel, color, elevation, font, motion, radius, type } from './src/design-system/tokens.js';

/** Utility classes are generated from src/design-system/tokens.js — no raw values here. */
const v = (group) => Object.fromEntries(Object.entries(group).map(([k, t]) => [k, t.value]));
const px = (n) => `${n}px`;
const c = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(' ');
const vars = (theme) => Object.fromEntries(Object.entries(color).map(([k, t]) => [`--c-${k}`, rgb(t[theme])]));

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,mdx}', './.storybook/**/*.{ts,tsx}'],
  theme: {
    // Every color is a CSS variable, so opacity modifiers (bg-ok/10) work and themes flip without touching components
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ink: c('ink'),
      navy: { DEFAULT: c('navy'), deep: c('navy-deep'), soft: c('navy-soft') },
      surface: c('surface'),
      canvas: c('canvas'),
      line: c('line'),
      muted: c('muted'),
      ok: { DEFAULT: c('ok'), ink: c('ok-ink') },
      risk: { DEFAULT: c('risk'), ink: c('risk-ink') },
      late: { DEFAULT: c('late'), ink: c('late-ink') },
      scrim: c('scrim'),
      desk: c('desk'),
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
      boxShadow: { ...v(elevation), phone: `0 40px 80px rgba(19, 26, 58, 0.18), 0 0 0 10px ${bezel}` },
      spacing: { 13: '52px', 18: '72px', 22: '88px' },
      zIndex: { sticky: '20', tabbar: '30', backdrop: '40', sheet: '50', toast: '60' },
      transitionTimingFunction: { out: motion['ease-out'].value, drawer: motion['ease-drawer'].value },
    },
  },
  plugins: [
    // Theme variables: light by default, dark by system preference or data-theme="dark"
    plugin(({ addBase }) =>
      addBase({
        ':root': { ...vars('light'), colorScheme: 'light' },
        '[data-theme="dark"]': { ...vars('dark'), colorScheme: 'dark' },
        '@media (prefers-color-scheme: dark)': { ':root:not([data-theme="light"])': { ...vars('dark'), colorScheme: 'dark' } },
      }),
    ),
  ],
};
