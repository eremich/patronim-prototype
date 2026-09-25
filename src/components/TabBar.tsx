import type { LucideIcon } from 'lucide-react';
import { cx } from '../lib/cx';

export interface TabItem {
  key: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

export interface TabBarProps {
  items: TabItem[];
  active: string;
  onSelect: (key: string) => void;
}

/** Labeled tabs, max 4 per role. Icon + text, never icon alone. */
export const TabBar = ({ items, active, onSelect }: TabBarProps) => (
  <nav aria-label="Main" className="z-tabbar border-t border-line bg-surface pb-5">
    <ul className="grid" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
      {items.map(({ key, label, icon: Icon, badge }) => {
        const on = key === active;
        return (
          <li key={key}>
            <button
              type="button"
              aria-current={on ? 'page' : undefined}
              onClick={() => onSelect(key)}
              className={cx(
                'press relative flex h-14 w-full flex-col items-center justify-center gap-0.5 text-caption transition-colors duration-150',
                on ? 'font-bold text-navy' : 'font-medium text-muted hover:text-ink',
              )}
            >
              <span className="relative">
                <Icon aria-hidden className="size-6" strokeWidth={on ? 2.25 : 1.75} />
                {!!badge && (
                  <span className="tnum absolute -right-2.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-chip bg-late px-1 text-caption font-bold leading-none text-surface">
                    {badge}
                    <span className="sr-only"> new</span>
                  </span>
                )}
              </span>
              {label}
            </button>
          </li>
        );
      })}
    </ul>
  </nav>
);
