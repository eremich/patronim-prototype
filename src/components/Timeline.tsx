import { Check } from 'lucide-react';
import { cx } from '../lib/cx';

export interface TimelineStep {
  title: string;
  detail?: string;
  state: 'done' | 'current' | 'next';
}

export interface TimelineProps {
  steps: TimelineStep[];
}

const STATE_TEXT = { done: ', done', current: ', in progress', next: ', next' };

/** Ordered "what happens next" steps. Order carries meaning, so numbers are shown. */
export const Timeline = ({ steps }: TimelineProps) => (
  <ol className="relative">
    {steps.map((s, i) => (
      <li key={s.title} className="relative flex gap-3 pb-5 last:pb-0">
        {i < steps.length - 1 && (
          <span aria-hidden className={cx('absolute bottom-0 left-4 top-8 w-0.5 -translate-x-1/2', s.state === 'done' ? 'bg-ok' : 'bg-line')} />
        )}
        <span
          aria-hidden
          className={cx(
            'tnum relative flex size-8 shrink-0 items-center justify-center rounded-chip text-caption font-bold',
            s.state === 'done' && 'bg-ok text-surface',
            s.state === 'current' && 'bg-navy text-surface',
            s.state === 'next' && 'border border-line bg-surface text-muted',
          )}
        >
          {s.state === 'done' ? <Check className="size-4" strokeWidth={3} /> : i + 1}
        </span>
        <div className="pt-1">
          <p className={cx('text-body font-bold', s.state === 'next' ? 'text-muted' : 'text-ink')}>
            {s.title}
            <span className="sr-only">{STATE_TEXT[s.state]}</span>
          </p>
          {s.detail && <p className="tnum text-caption text-muted">{s.detail}</p>}
        </div>
      </li>
    ))}
  </ol>
);
