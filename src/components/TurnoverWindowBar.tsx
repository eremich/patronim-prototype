import { cx } from '../lib/cx';
import { clock, duration } from '../lib/time';

export type WindowHealth = 'ok' | 'risk' | 'late';
export type WindowPhase = 'scheduled' | 'cleaning' | 'inspection' | 'rework' | 'ready';

export interface TurnoverWindowBarProps {
  /** Guest checkout, minutes */
  checkout: number;
  /** Next guest check-in, minutes. The real deadline. */
  checkin: number;
  /** Cleaning start (planned or actual) */
  start: number;
  /** Cleaning end (planned or projected) */
  finish: number;
  /** Current time; hidden when outside the window */
  now?: number;
  health: WindowHealth;
  /** 0–1 share of the cleaning that is done */
  progress?: number;
  phase?: WindowPhase;
  /** Minutes an inspection takes after the clean */
  inspectionMin?: number;
  variant?: 'full' | 'compact';
}

const FILL: Record<WindowHealth, string> = { ok: 'bg-ok', risk: 'bg-risk', late: 'bg-late' };
const HATCH: Record<WindowHealth, string> = { ok: 'bg-ok/10 text-ok/45', risk: 'bg-risk/15 text-risk/55', late: 'bg-late/10 text-late/45' };
const INK: Record<WindowHealth, string> = { ok: 'text-ok-ink', risk: 'text-risk-ink', late: 'text-late-ink' };

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/**
 * The one bold element of Patronim: checkout on the left, guest check-in on the right,
 * the cleaning block inside, and a "now" marker. Color follows health; the label says it in words.
 */
export const TurnoverWindowBar = ({
  checkout,
  checkin,
  start,
  finish,
  now,
  health,
  progress = 0,
  phase = 'scheduled',
  inspectionMin = 30,
  variant = 'full',
}: TurnoverWindowBarProps) => {
  const ready = phase === 'ready';
  const inspectEnd = finish + inspectionMin;
  // Compact bars don't draw the inspection tail, so it must not stretch their scale
  const hi = Math.max(checkin, variant === 'full' ? inspectEnd : finish);
  const lo = Math.min(checkout, start);
  const span = Math.max(1, hi - lo);
  const pct = (t: number) => ((t - lo) / span) * 100;

  const blockLeft = pct(start);
  const blockWidth = Math.max(2, pct(finish) - blockLeft);
  const inspectWidth = pct(inspectEnd) - pct(finish);
  const done = ready || phase === 'inspection' ? 1 : clamp(progress, 0, 1);
  const showNow = now !== undefined && now >= lo && now <= hi && !ready;
  const overflow = hi > checkin;

  const spare = checkin - inspectEnd;
  const verdict = ready
    ? 'Ready for guest'
    : finish > checkin
      ? `Finishes ${duration(finish - checkin)} after check-in`
      : spare < 0
        ? `No time left for inspection`
        : spare === 0
          ? 'Ready right at check-in'
          : `${duration(spare)} to spare`;

  const label = `Turnover window from checkout ${clock(checkout)} to guest check-in ${clock(checkin)}. Cleaning ${clock(start)} to ${clock(finish)}. ${verdict}.`;

  const track = (height: string) => (
    <div className={cx('relative w-full rounded-bar bg-canvas', height)}>
      <div className="absolute inset-0 rounded-bar border border-line" />
      {overflow && (
        <div
          className="absolute inset-y-0 right-0 rounded-r-bar bg-late/10"
          style={{ left: `${pct(checkin)}%` }}
        />
      )}
      {/* Cleaning block: solid = done, hatched = still to do */}
      <div
        className={cx('absolute inset-y-0.5 flex overflow-hidden rounded-inner', HATCH[health])}
        style={{ left: `${blockLeft}%`, width: `${blockWidth}%` }}
      >
        <div className={cx('h-full', FILL[health])} style={{ width: `${done * 100}%` }} />
        <div className="hatch h-full flex-1" />
      </div>
      {/* Inspection tail */}
      {variant === 'full' && inspectWidth > 0 && (
        <div
          className={cx(
            'absolute inset-y-1.5 rounded-r-inner border border-l-0',
            ready ? 'border-ok bg-ok/60' : 'border-navy/40 bg-navy-soft',
          )}
          style={{ left: `${pct(finish)}%`, width: `${inspectWidth}%` }}
        />
      )}
      {overflow && <div className="absolute -inset-y-1 w-0.5 rounded-chip bg-ink" style={{ left: `${pct(checkin)}%` }} />}
      {showNow && (
        <div className="absolute -inset-y-1.5 flex justify-center" style={{ left: `${pct(now!)}%` }}>
          <div className="w-0.5 -translate-x-1/2 rounded-chip bg-ink" />
          <div className="absolute -top-0.5 size-2 -translate-x-1/2 rounded-chip border-2 border-surface bg-ink" style={{ left: 0 }} />
        </div>
      )}
    </div>
  );

  if (variant === 'compact') {
    return (
      <div role="img" aria-label={label} className="flex items-center gap-2">
        <span className="tnum text-caption text-muted">{clock(checkout)}</span>
        <div className="flex-1">{track('h-3')}</div>
        <span className="tnum text-caption font-bold text-ink">{clock(checkin)}</span>
      </div>
    );
  }

  return (
    <figure role="img" aria-label={label} className="m-0">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-caption text-muted">Checkout</div>
          <div className="tnum text-headline font-medium text-ink">{clock(checkout)}</div>
        </div>
        <div className="text-right">
          <div className="text-caption text-muted">Guest check-in</div>
          <div className="tnum text-headline font-bold text-ink">{clock(checkin)}</div>
        </div>
      </div>
      {/* Own row for the "now" pill so it never collides with the edge times */}
      <div className="relative mb-1.5 mt-1 h-6">
        {showNow && (
          <div
            className="tnum absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-chip bg-ink px-2 py-0.5 text-caption font-bold text-surface"
            style={{ left: `${clamp(pct(now!), 11, 89)}%` }}
          >
            Now {clock(now!)}
          </div>
        )}
      </div>
      {track('h-10')}
      <figcaption className="mt-2.5 flex items-baseline justify-between gap-3 text-caption">
        <span className="tnum text-muted">
          Cleaning {clock(start)}–{clock(finish)}
        </span>
        <span className={cx('tnum text-right font-bold', ready ? INK.ok : INK[health])}>{verdict}</span>
      </figcaption>
    </figure>
  );
};
