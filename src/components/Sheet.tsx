import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cx } from '../lib/cx';

export interface SheetProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  /** Element the sheet renders into. Defaults to the phone screen overlay slot. */
  container?: HTMLElement | null;
}

const EXIT_MS = 200;

/** Bottom sheet. Slides up with the drawer curve, closes faster than it opens. */
export const Sheet = ({ open, title, description, onClose, children, footer, container }: SheetProps) => {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(raf);
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!shown) return;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shown, onClose]);

  const target = container ?? (typeof document !== 'undefined' ? document.getElementById('sheet-root') : null);
  if (!mounted || !target) return null;

  return createPortal(
    <div className="pointer-events-auto absolute inset-0 z-sheet flex flex-col justify-end">
      <div
        aria-hidden
        onClick={onClose}
        className={cx('absolute inset-0 bg-scrim/40 transition-opacity', shown ? 'opacity-100 duration-300' : 'opacity-0 duration-200')}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cx(
          'relative flex max-h-[88%] flex-col rounded-t-sheet bg-surface shadow-sheet outline-none transition-transform',
          shown ? 'translate-y-0 duration-300 ease-drawer' : 'translate-y-full duration-200 ease-out',
        )}
      >
        <div aria-hidden className="mx-auto mt-2 h-1 w-9 rounded-chip bg-line" />
        <div className="flex items-start gap-3 px-4 pb-2 pt-3">
          <div className="flex-1">
            <h2 id={titleId} className="text-title font-bold text-ink">
              {title}
            </h2>
            {description && <p className="mt-1 text-body text-muted">{description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="press -mr-2 -mt-1 flex size-11 items-center justify-center rounded-chip text-muted hover:bg-canvas">
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <div className="scroll-area flex-1 px-4 pb-4">{children}</div>
        {footer && <div className="border-t border-line px-4 pb-8 pt-3">{footer}</div>}
      </div>
    </div>,
    target,
  );
};
