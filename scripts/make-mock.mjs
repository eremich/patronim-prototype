// Generates the placeholder "photos" in public/mock/ (flat SVG illustrations, no hotlinking).
// Run: node scripts/make-mock.mjs
import { mkdirSync, writeFileSync } from 'node:fs';

const OUT = new URL('../public/mock/', import.meta.url);
mkdirSync(OUT, { recursive: true });
const save = (name, body, w = 800, h = 600) =>
  writeFileSync(new URL(name, OUT), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>\n`);

const plant = (x, y, s = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0 0 C-40 -60 -30 -120 -6 -150 C -10 -100 0 -60 0 0Z" fill="#4F8A68"/>
    <path d="M0 0 C30 -50 60 -90 50 -140 C30 -100 10 -60 0 0Z" fill="#3E7658"/>
    <path d="M0 0 C-10 -70 10 -130 26 -170 C 30 -110 14 -60 0 0Z" fill="#5B9A74"/>
    <path d="M-28 0 h56 l-8 56 h-40z" fill="#C9B8A6"/>
  </g>`;

const light = `<radialGradient id="sun" cx="0.3" cy="0.2" r="0.9"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`;

// Bedroom
save(
  'room-bedroom.svg',
  `<defs>${light}</defs>
  <rect width="800" height="600" fill="#E9ECF2"/>
  <rect y="430" width="800" height="170" fill="#D8C7B3"/>
  <rect x="520" y="70" width="210" height="250" rx="6" fill="#CFE3F2"/><rect x="520" y="70" width="210" height="250" rx="6" fill="none" stroke="#fff" stroke-width="12"/>
  <path d="M625 70v250M520 195h210" stroke="#fff" stroke-width="8"/>
  <rect x="120" y="230" width="380" height="120" rx="14" fill="#2B3A67"/>
  <rect x="90" y="330" width="440" height="130" rx="18" fill="#F7F8FB"/>
  <path d="M90 380h440v60a18 18 0 0 1-18 18H108a18 18 0 0 1-18-18z" fill="#E4E8F1"/>
  <rect x="140" y="300" width="130" height="56" rx="16" fill="#fff"/><rect x="290" y="300" width="130" height="56" rx="16" fill="#fff"/>
  <rect x="330" y="360" width="200" height="98" rx="10" fill="#9DB0D6" opacity=".7"/>
  <rect x="560" y="360" width="100" height="100" rx="8" fill="#B08D6E"/>
  <path d="M610 360v-60" stroke="#8C8C8C" stroke-width="4"/><path d="M585 300h50l-10-40h-30z" fill="#F2E3C4"/>
  ${plant(720, 520, 0.9)}
  <rect width="800" height="600" fill="url(#sun)"/>`,
);

// Bathroom
save(
  'room-bathroom.svg',
  `<defs>${light}<pattern id="tile" width="50" height="50" patternUnits="userSpaceOnUse"><rect width="50" height="50" fill="#EEF2F6"/><path d="M50 0V50H0" fill="none" stroke="#D5DCE6" stroke-width="2"/></pattern></defs>
  <rect width="800" height="600" fill="url(#tile)"/>
  <rect y="470" width="800" height="130" fill="#C8CFD9"/>
  <rect x="250" y="70" width="220" height="190" rx="18" fill="#DDEBF5" stroke="#B9C3CF" stroke-width="8"/>
  <path d="M285 110l60 -30M300 150l110 -60" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".8"/>
  <rect x="220" y="300" width="280" height="30" rx="8" fill="#fff"/>
  <path d="M260 300q100 60 200 0" fill="#E4EAF1"/>
  <rect x="235" y="330" width="250" height="140" rx="10" fill="#B08D6E"/>
  <path d="M360 330v140" stroke="#997559" stroke-width="4"/>
  <path d="M360 300v-26h24" stroke="#9AA3AE" stroke-width="8" fill="none" stroke-linecap="round"/>
  <rect x="560" y="60" width="200" height="410" fill="#D9E8F2" opacity=".6" stroke="#B9C3CF" stroke-width="6"/>
  <path d="M700 90v40q0 20 -20 20" stroke="#9AA3AE" stroke-width="8" fill="none"/>
  <path d="M40 220h140" stroke="#9AA3AE" stroke-width="8" stroke-linecap="round"/>
  <rect x="55" y="220" width="50" height="130" rx="6" fill="#F7F8FB"/><rect x="115" y="220" width="50" height="100" rx="6" fill="#9DB0D6"/>
  <rect width="800" height="600" fill="url(#sun)"/>`,
);

// Kitchen
save(
  'room-kitchen.svg',
  `<defs>${light}</defs>
  <rect width="800" height="600" fill="#F0EEEA"/>
  <rect x="60" y="60" width="300" height="130" rx="6" fill="#DDE3EC"/><path d="M160 60v130M260 60v130" stroke="#C7CFDB" stroke-width="4"/>
  <rect x="420" y="60" width="200" height="180" rx="6" fill="#CFE3F2" stroke="#fff" stroke-width="12"/>
  <rect y="330" width="800" height="18" fill="#FFFFFF"/>
  <rect y="348" width="800" height="200" fill="#2B3A67"/><path d="M200 348v200M400 348v200M600 348v200" stroke="#223058" stroke-width="4"/>
  <path d="M180 440h40M380 440h40M580 440h40" stroke="#C9CED8" stroke-width="6" stroke-linecap="round"/>
  <rect y="548" width="800" height="52" fill="#D8C7B3"/>
  <rect x="80" y="316" width="160" height="14" rx="4" fill="#2A2A2A"/><circle cx="120" cy="323" r="5" fill="#555"/><circle cx="200" cy="323" r="5" fill="#555"/>
  <path d="M300 330v-50a24 24 0 0 1 48 0v50z" fill="#E7EBF3" stroke="#B9C3CF" stroke-width="4"/>
  <path d="M520 0v60" stroke="#8C8C8C" stroke-width="3"/><path d="M490 60h60l-10 26h-40z" fill="#1B2FA0"/>
  ${plant(700, 330, 0.7)}
  <rect x="440" y="290" width="70" height="40" rx="8" fill="#C9B8A6"/>
  <rect width="800" height="600" fill="url(#sun)"/>`,
);

// Living room
save(
  'room-living.svg',
  `<defs>${light}</defs>
  <rect width="800" height="600" fill="#ECEEF3"/>
  <rect y="440" width="800" height="160" fill="#D8C7B3"/>
  <rect x="560" y="60" width="200" height="380" fill="#CFE3F2" stroke="#fff" stroke-width="12"/><path d="M660 60v380" stroke="#fff" stroke-width="8"/>
  <rect x="120" y="110" width="170" height="120" fill="#fff" stroke="#2B3A67" stroke-width="8"/><circle cx="185" cy="170" r="30" fill="#E9A23B"/><path d="M130 220l60-40 50 30 40-20v30z" fill="#1B2FA0"/>
  <ellipse cx="330" cy="520" rx="260" ry="40" fill="#C7B39C"/>
  <rect x="80" y="310" width="400" height="120" rx="24" fill="#9DB0D6"/>
  <rect x="60" y="360" width="440" height="90" rx="24" fill="#8499C6"/>
  <rect x="110" y="300" width="100" height="70" rx="18" fill="#F2E3C4"/><rect x="340" y="300" width="100" height="70" rx="18" fill="#E7EBF3"/>
  <rect x="250" y="470" width="180" height="16" rx="6" fill="#B08D6E"/><path d="M270 486v30M410 486v30" stroke="#997559" stroke-width="6"/>
  <path d="M520 450v-230" stroke="#555" stroke-width="5"/><path d="M490 220h60l-12-44h-36z" fill="#F7F8FB"/>
  <rect width="800" height="600" fill="url(#sun)"/>`,
);

// Close-up of the mirror with streaks, as an inspector would photograph it
save(
  'redo-mirror.svg',
  `<rect width="800" height="600" fill="#E7ECF2"/>
  <rect x="120" y="60" width="560" height="480" rx="30" fill="#D6E4EF" stroke="#B9C3CF" stroke-width="14"/>
  <path d="M200 140l180 -60M230 220l300 -110" stroke="#fff" stroke-width="18" stroke-linecap="round" opacity=".6"/>
  <g stroke="#A9B4BF" stroke-width="10" stroke-linecap="round" opacity=".75" fill="none">
    <path d="M300 300q60 30 120 0t120 0"/><path d="M320 350q60 30 120 0t120 0"/><path d="M340 400q50 24 100 0t100 0"/>
  </g>
  <circle cx="430" cy="350" r="150" fill="none" stroke="#C8363B" stroke-width="10" stroke-dasharray="4 18" stroke-linecap="round"/>`,
);

// Tel Aviv Bauhaus-style exteriors
const building = (name, { wall, accent, floors, sky, palm }) => {
  const rows = Array.from({ length: floors }, (_, i) => {
    const y = 470 - (i + 1) * 90;
    return `<rect x="170" y="${y}" width="460" height="18" rx="9" fill="#fff"/>
      <rect x="200" y="${y + 24}" width="90" height="52" rx="4" fill="#9FB6CF"/><rect x="330" y="${y + 24}" width="140" height="52" rx="4" fill="#9FB6CF"/><rect x="510" y="${y + 24}" width="90" height="52" rx="4" fill="#9FB6CF"/>
      <path d="M200 ${y + 50}h90M330 ${y + 50}h140" stroke="${accent}" stroke-width="3"/>`;
  }).join('');
  const top = 470 - floors * 90;
  save(
    name,
    `<rect width="800" height="600" fill="${sky}"/>
    <circle cx="680" cy="110" r="46" fill="#FFF3D6"/>
    <rect x="180" y="${top - 10}" width="440" height="${470 - top + 10}" fill="${wall}"/>
    <path d="M620 ${top - 10}a80 80 0 0 1 0 ${Math.min(240, 470 - top)}" fill="${wall}"/>
    ${rows}
    <rect x="370" y="390" width="60" height="80" rx="4" fill="${accent}"/>
    <rect y="470" width="800" height="130" fill="#D9D3C7"/><rect y="500" width="800" height="100" fill="#A9A9A9"/>
    ${palm ? `<path d="M110 500q10 -160 -6 -260" stroke="#8C6B4E" stroke-width="16" fill="none"/><g fill="#4F8A68"><path d="M104 240q-90 -10 -100 50q40 -40 100 -50z"/><path d="M104 240q90 -20 110 40q-50 -40 -110 -40z"/><path d="M104 240q-30 -80 -100 -80q60 20 100 80z"/><path d="M104 240q40 -80 110 -70q-70 20 -110 70z"/></g>` : plant(110, 470, 1)}`,
  );
};

building('property-ben-yehuda.svg', { wall: '#F4F1EA', accent: '#1B2FA0', floors: 3, sky: '#CFE3F2', palm: true });
building('property-hayarkon.svg', { wall: '#FFFFFF', accent: '#2B3A67', floors: 4, sky: '#BFD9EE', palm: true });
building('property-bograshov.svg', { wall: '#EDE7DB', accent: '#4F8A68', floors: 3, sky: '#D6E6F2', palm: false });
building('property-levinski.svg', { wall: '#E9ECF2', accent: '#C9820A', floors: 2, sky: '#CFE3F2', palm: false });
building('property-weizmann.svg', { wall: '#F7F4EE', accent: '#1B2FA0', floors: 4, sky: '#C6DDF0', palm: true });

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

console.log('mock images written');
