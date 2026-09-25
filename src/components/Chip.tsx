import type { ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface ChipProps {
  label: string;
  sublabel?: string;
  selected?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

/** Selectable pill. Selected = brand tint + border, plus aria-pressed. */
export const Chip = ({ label, sublabel, selected = false, icon, onClick, disabled }: ChipProps) => (
  <button
    type="button"
    aria-pressed={selected}
    disabled={disabled}
    onClick={onClick}
    className={cx(
      'press inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-chip border px-4 text-body transition-colors duration-150',
      selected ? 'border-navy bg-navy-soft font-bold text-navy' : 'border-line bg-surface font-medium text-ink hover:border-navy/40',
      disabled && 'opacity-50',
    )}
  >
    {icon}
    <span>{label}</span>
    {sublabel && <span className={cx('tnum text-caption', selected ? 'text-navy' : 'text-muted')}>{sublabel}</span>}
  </button>
);
