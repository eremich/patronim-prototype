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

/**
 * Floating glass tab bar (iOS 26). Labeled tabs, max 4 per role, icon + text.
 * Positioning is the caller's job: the app floats it over content, Storybook shows it over a sample list.
 */
export const TabBar = ({ items, active, onSelect }: TabBarProps) => {
  const index = Math.max(0, items.findIndex((i) => i.key === active));
  return (
    <nav aria-label="Main" className="material-glass rounded-chip p-1 shadow-floating">
      <ul className="relative grid" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {/* Selected capsule slides between tabs */}
        <li
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 rounded-chip bg-navy-soft transition-transform duration-indicator ease-out"
          style={{ width: `${100 / items.length}%`, transform: `translateX(${index * 100}%)` }}
        />
        {items.map(({ key, label, icon: Icon, badge }) => {
          const on = key === active;
          return (
            <li key={key} className="relative">
              <button
                type="button"
                aria-current={on ? 'page' : undefined}
                onClick={() => onSelect(key)}
                className={cx(
                  'press flex h-14 w-full flex-col items-center justify-center gap-0.5 rounded-chip text-caption transition-colors duration-150',
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
};
