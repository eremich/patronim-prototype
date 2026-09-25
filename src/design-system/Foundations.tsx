import type { ReactNode } from 'react';
import { color, elevation, motion, radius, space, type } from './tokens.js';

/** Foundations pages render tokens.js directly — values are never copied into docs. */

const hexToRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const lum = (hex: string) => {
  const [r, g, b] = hexToRgb(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrast = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const Page = ({ title, lead, children }: { title: string; lead: string; children: ReactNode }) => (
  <div className="min-h-screen bg-surface p-8 font-sans text-ink">
    <h1 className="text-display font-bold">{title}</h1>
    <p className="mt-1 max-w-2xl text-body text-muted">{lead}</p>
    <div className="mt-8">{children}</div>
  </div>
);

const Grade = ({ ratio }: { ratio: number }) => {
  const pass = ratio >= 4.5 ? 'AA text' : ratio >= 3 ? 'Large text / UI only' : 'Decorative only';
  const tone = ratio >= 4.5 ? 'bg-ok/10 text-ok-ink' : ratio >= 3 ? 'bg-risk/15 text-risk-ink' : 'bg-canvas text-muted';
  return (
    <span className={`tnum inline-flex rounded-chip px-2 py-0.5 text-caption font-bold ${tone}`}>
      {ratio.toFixed(2)}:1 · {pass}
    </span>
  );
};

type Theme = 'light' | 'dark';

const Swatch = ({ hex, theme }: { hex: string; theme: Theme }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2">
      <div className="h-10 w-16 shrink-0 rounded-control border border-line" style={{ background: hex }} />
      <code className="text-caption text-muted">{hex}</code>
    </div>
    <span className="text-caption text-muted">
      surface <Grade ratio={contrast(hex, color.surface[theme])} />
    </span>
    <span className="text-caption text-muted">
      canvas <Grade ratio={contrast(hex, color.canvas[theme])} />
    </span>
  </div>
);

export const ColorsPage = () => (
  <Page
    title="Colors"
    lead="One set of names, two themes. Components use the names; the values flip with the theme. Contrast is computed live against that theme's surface and canvas."
  >
    <div className="grid grid-cols-[1fr_auto_auto] gap-x-8 border-b border-line pb-2 text-caption font-bold text-muted">
      <span>Token</span>
      <span className="w-56">Light</span>
      <span className="w-56">Dark</span>
    </div>
    <div className="divide-y divide-line">
      {Object.entries(color).map(([name, t]) => (
        <div key={name} className="grid grid-cols-[1fr_auto_auto] items-start gap-x-8 py-4">
          <div>
            <div className="text-headline font-bold">{name}</div>
            <div className="max-w-sm text-body text-muted">{t.use}</div>
          </div>
          <div className="w-56">
            <Swatch hex={t.light} theme="light" />
          </div>
          <div className="w-56">
            <Swatch hex={t.dark} theme="dark" />
          </div>
        </div>
      ))}
    </div>
  </Page>
);

export const TypePage = () => (
  <Page title="Typography" lead="Hanken Grotesk for everything, weights 400 / 500 / 700. Tabular numerals for all times and prices. Sentence case everywhere.">
    <div className="divide-y divide-line">
      {Object.entries(type).map(([name, t]) => (
        <div key={name} className="grid grid-cols-[160px_1fr] items-baseline gap-6 py-5">
          <div>
            <div className="text-body font-bold">{name}</div>
            <div className="tnum text-caption text-muted">
              {t.size} / {t.line} · {t.use}
            </div>
          </div>
          <div style={{ fontSize: t.size, lineHeight: `${t.line}px`, letterSpacing: t.tracking }} className="font-bold">
            Guest arrives in <span className="tnum">3 h 10 min</span>
          </div>
        </div>
      ))}
      <div className="grid grid-cols-[160px_1fr] items-baseline gap-6 py-5">
        <div className="text-body font-bold">tnum</div>
        <div className="text-title">
          <div>Proportional 11:11 → 18:48 · ₪1,111</div>
          <div className="tnum">Tabular&nbsp;&nbsp;&nbsp; 11:11 → 18:48 · ₪1,111</div>
        </div>
      </div>
    </div>
  </Page>
);

export const ShapePage = () => (
  <Page title="Shape, space and elevation" lead="Radius follows hierarchy. 4 px grid, 16 px screen padding, 44 px touch targets. Elevation only on sheets, sticky footers and toasts.">
    <h2 className="mb-3 text-title font-bold">Radius</h2>
    <div className="flex flex-wrap gap-4">
      {Object.entries(radius).map(([name, t]) => (
        <div key={name} className="w-40">
          <div className="h-24 border-2 border-navy bg-navy-soft" style={{ borderRadius: Math.min(t.value, 48) }} />
          <div className="mt-2 text-body font-bold">
            {name} <span className="tnum font-normal text-muted">{t.value}</span>
          </div>
          <div className="text-caption text-muted">{t.use}</div>
        </div>
      ))}
    </div>
    <h2 className="mb-3 mt-10 text-title font-bold">Spacing (4 px grid)</h2>
    <div className="flex items-end gap-3">
      {space.steps.map((s) => (
        <div key={s} className="flex flex-col items-center gap-1">
          <div className="bg-navy" style={{ width: s, height: s }} />
          <span className="tnum text-caption text-muted">{s}</span>
        </div>
      ))}
    </div>
    <p className="mt-3 text-body text-muted">
      Screen padding {space.screen}. Touch targets at least {space.touch} × {space.touch}.
    </p>
    <h2 className="mb-3 mt-10 text-title font-bold">Elevation</h2>
    <div className="flex flex-wrap gap-6 bg-canvas p-6">
      {Object.entries(elevation).map(([name, t]) => (
        <div key={name} className="w-48 rounded-card bg-surface p-4" style={{ boxShadow: t.value }}>
          <div className="text-body font-bold">{name}</div>
          <div className="text-caption text-muted">{t.use}</div>
        </div>
      ))}
      <div className="w-48 rounded-card border border-line bg-surface p-4">
        <div className="text-body font-bold">card</div>
        <div className="text-caption text-muted">No shadow. Hairline border on canvas.</div>
      </div>
    </div>
  </Page>
);

export const MotionPage = () => (
  <Page title="Motion" lead="Motion shows state: a press, a sheet arriving, a toast confirming. Under 300 ms, strong ease-out, and a crossfade when reduced motion is on.">
    <table className="w-full text-left text-body">
      <thead>
        <tr className="border-b border-line text-caption text-muted">
          <th className="py-2">Token</th>
          <th>Value</th>
          <th>Use</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(motion).map(([name, t]) => (
          <tr key={name} className="border-b border-line">
            <td className="py-3 font-bold">{name}</td>
            <td>
              <code className="text-caption">{t.value}</code>
            </td>
            <td className="text-muted">{t.use}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Page>
);
