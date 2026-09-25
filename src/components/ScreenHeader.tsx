import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';

export interface ScreenHeaderProps {
  title: string;
  subtitle?: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  trailing?: ReactNode;
  /** Large title for tab roots, compact for pushed screens */
  large?: boolean;
}

export const ScreenHeader = ({ title, subtitle, onBack, backLabel = 'Back', trailing, large = false }: ScreenHeaderProps) =>
  large ? (
    <header className="flex items-end justify-between gap-3 px-4 pb-4 pt-2">
      <div>
        {subtitle && <p className="tnum text-caption font-medium text-muted">{subtitle}</p>}
        <h1 className="text-display font-bold text-ink">{title}</h1>
      </div>
      {trailing}
    </header>
  ) : (
    <header className="grid h-13 grid-cols-[1fr_auto_1fr] items-center px-2">
      <div>
        {onBack && (
          <button type="button" onClick={onBack} className="press flex h-11 items-center gap-0.5 rounded-control pl-1 pr-3 text-body font-medium text-navy hover:bg-navy-soft">
            <ChevronLeft aria-hidden className="size-6" />
            {backLabel}
          </button>
        )}
      </div>
      <h1 className="truncate text-headline font-bold text-ink">{title}</h1>
      <div className="flex justify-end">{trailing}</div>
    </header>
  );
