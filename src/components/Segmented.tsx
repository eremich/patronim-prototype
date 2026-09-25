import { cx } from '../lib/cx';

export interface SegmentedProps<K extends string> {
  label: string;
  options: { key: K; label: string; count?: number }[];
  value: K;
  onChange: (key: K) => void;
}

export const Segmented = <K extends string>({ label, options, value, onChange }: SegmentedProps<K>) => (
  <div role="tablist" aria-label={label} className="flex rounded-control bg-line/60 p-1">
    {options.map((o) => {
      const on = o.key === value;
      return (
        <button
          key={o.key}
          role="tab"
          type="button"
          aria-selected={on}
          onClick={() => onChange(o.key)}
          className={cx(
            'press flex h-9 flex-1 items-center justify-center gap-1.5 rounded-bar text-body transition-colors duration-150',
            on ? 'bg-surface font-bold text-ink' : 'font-medium text-muted hover:text-ink',
          )}
        >
          {o.label}
          {o.count !== undefined && <span className={cx('tnum text-caption', on ? 'text-navy' : 'text-muted')}>{o.count}</span>}
        </button>
      );
    })}
  </div>
);
