import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { cx } from '../lib/cx';

export interface ScreenHeaderProps {
  title: string;
  subtitle?: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  trailing?: ReactNode;
  /** Large title for tab roots, compact bar for pushed screens */
  large?: boolean;
}

/** Height of the compact bar the large title collapses into */
const BAR_PX = 44;

/** Nearest ancestor that scrolls vertically, so the header works in the app and in Storybook */
const scrollParent = (el: HTMLElement | null): HTMLElement | null => {
  for (let n = el?.parentElement; n; n = n.parentElement) {
    const oy = getComputedStyle(n).overflowY;
    if (oy === 'auto' || oy === 'scroll') return n;
  }
  return null;
};

/** iOS-style: the large title scrolls away and the same title appears in a compact bar */
const LargeHeader = ({ title, subtitle, trailing }: Pick<ScreenHeaderProps, 'title' | 'subtitle' | 'trailing'>) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const el = titleRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setCollapsed(!e.isIntersecting), {
      root: scrollParent(el),
      // Switch when the large title slides under the compact bar
      rootMargin: `-${BAR_PX}px 0px 0px 0px`,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Zero-height sticky anchor: the bar overlays content, so nothing shifts */}
      <div className="sticky top-0 z-sticky h-0">
        <div
          aria-hidden
          className={cx(
            'absolute inset-x-0 top-0 flex h-11 items-center justify-center border-b bg-canvas/90 px-4 backdrop-blur-md transition-[opacity,border-color] duration-150 ease-out',
            collapsed ? 'border-line opacity-100' : 'pointer-events-none border-transparent opacity-0',
          )}
        >
          <span className="truncate text-headline font-bold text-ink">{title}</span>
        </div>
      </div>
      <header className="flex items-end justify-between gap-3 px-4 pb-4 pt-2">
        <div>
          {subtitle && <p className="tnum text-caption font-medium text-muted">{subtitle}</p>}
          <h1 ref={titleRef} className="text-display font-bold text-ink">
            {title}
          </h1>
        </div>
        {trailing}
      </header>
    </>
  );
};

export const ScreenHeader = ({ title, subtitle, onBack, backLabel = 'Back', trailing, large = false }: ScreenHeaderProps) =>
  large ? (
    <LargeHeader title={title} subtitle={subtitle} trailing={trailing} />
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
