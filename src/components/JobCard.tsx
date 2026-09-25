import type { ReactNode } from 'react';
import { StatusBadge, type StatusBadgeProps } from './StatusBadge';
import { TurnoverWindowBar, type TurnoverWindowBarProps } from './TurnoverWindowBar';
import { cx } from '../lib/cx';

export interface JobCardProps {
  title: string;
  subtitle: ReactNode;
  status?: StatusBadgeProps;
  window: TurnoverWindowBarProps;
  /** Line under the bar: cleaner, progress, or what needs attention */
  meta?: ReactNode;
  /** Optional lead line above the title, e.g. "Guest arrives in 3 h 10 min" */
  lead?: ReactNode;
  tone?: 'default' | 'risk' | 'late';
  onClick?: () => void;
}

const TONE = { default: 'border-line', risk: 'border-risk/60', late: 'border-late/50' };

/** One turnover in a list: what, where, status, and its window. Used by all three roles. */
export const JobCard = ({ title, subtitle, status, window, meta, lead, tone = 'default', onClick }: JobCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cx('press block w-full rounded-card border bg-surface p-4 text-left transition-colors duration-150 hover:border-navy/40', TONE[tone])}
  >
    {lead}
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="truncate text-headline font-bold text-ink">{title}</h3>
        <p className="text-caption text-muted">{subtitle}</p>
      </div>
      {status && <StatusBadge {...status} size="sm" />}
    </div>
    <div className="mt-3">
      <TurnoverWindowBar {...window} variant="compact" />
    </div>
    {meta && <div className="mt-2.5 text-caption text-muted">{meta}</div>}
  </button>
);
