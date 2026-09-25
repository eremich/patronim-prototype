import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cx } from '../lib/cx';

export interface ListItemProps {
  title: ReactNode;
  subtitle?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  /** Shows a chevron and makes the row pressable */
  onClick?: () => void;
  divider?: boolean;
}

export const ListItem = ({ title, subtitle, leading, trailing, onClick, divider = false }: ListItemProps) => {
  const content = (
    <>
      {leading && <span className="flex shrink-0 items-center">{leading}</span>}
      <span className="flex min-w-0 flex-1 flex-col text-left">
        <span className="truncate text-body font-medium text-ink">{title}</span>
        {subtitle && <span className="text-caption text-muted">{subtitle}</span>}
      </span>
      {trailing && <span className="flex shrink-0 items-center text-body text-ink">{trailing}</span>}
      {onClick && <ChevronRight aria-hidden className="size-5 shrink-0 text-muted" />}
    </>
  );
  const cls = cx('flex min-h-14 w-full items-center gap-3 py-2', divider && 'border-b border-line last:border-b-0');
  return onClick ? (
    <button type="button" onClick={onClick} className={cx(cls, 'press rounded-control text-left')}>
      {content}
    </button>
  ) : (
    <div className={cls}>{content}</div>
  );
};
