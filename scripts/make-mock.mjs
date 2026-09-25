// Generates the static inspector map in public/mock/ (flat SVG, no hotlinking).
// Room, facade and redo photos are real JPGs supplied by the designer, stored in public/mock/.
// Run: node scripts/make-mock.mjs
import { mkdirSync, writeFileSync } from 'node:fs';

const OUT = new URL('../public/mock/', import.meta.url);
mkdirSync(OUT, { recursive: true });
const save = (name, body, w = 800, h = 600) =>
  writeFileSync(new URL(name, OUT), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>\n`);

// Static map of central Tel Aviv: sea to the west, street grid, pins drawn by the app on top
save(
  'map-tel-aviv.svg',
  `<rect width="390" height="700" fill="#EEF1F5"/>
  <path d="M0 0h70q-20 120 10 240t-10 250q-20 110 10 210H0z" fill="#C9DDF0"/>
  <path d="M80 0q-20 120 10 240t-10 250q-20 110 10 210" stroke="#E7DCC5" stroke-width="16" fill="none"/>
  <g stroke="#FFFFFF" stroke-width="14" fill="none" stroke-linecap="round">
    <path d="M120 0v700"/><path d="M200 0l20 700"/><path d="M290 0l-10 700"/>
    <path d="M60 120h330"/><path d="M60 260l330 30"/><path d="M60 400h330"/><path d="M60 540l330 -20"/>
  </g>
  <g stroke="#FFFFFF" stroke-width="6" fill="none"><path d="M160 0v700"/><path d="M250 0v700"/><path d="M60 190h330"/><path d="M60 330h330"/><path d="M60 470h330"/><path d="M60 610h330"/></g>
  <rect x="300" y="120" width="70" height="110" rx="10" fill="#D5E6D6"/><rect x="140" y="560" width="90" height="70" rx="10" fill="#D5E6D6"/>`,
  390,
  700,
);

console.log('map written');
