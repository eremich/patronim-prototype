import type { LucideIcon } from 'lucide-react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { cx } from '../lib/cx';

export type ThemeValue = 'system' | 'light' | 'dark';

export interface ThemeSwitchProps {
  value: ThemeValue;
  onChange: (value: ThemeValue) => void;
  label?: string;
}

const OPTIONS: { key: ThemeValue; label: string; icon: LucideIcon }[] = [
  { key: 'system', label: 'System', icon: Monitor },
  { key: 'light', label: 'Light', icon: Sun },
  { key: 'dark', label: 'Dark', icon: Moon },
];

/** Appearance setting: follow the system, or force light or dark */
export const ThemeSwitch = ({ value, onChange, label = 'Appearance' }: ThemeSwitchProps) => (
  <div role="radiogroup" aria-label={label} className="flex rounded-control bg-line/60 p-1">
    {OPTIONS.map(({ key, label: text, icon: Icon }) => {
      const on = key === value;
      return (
        <button
          key={key}
          type="button"
          role="radio"
          aria-checked={on}
          onClick={() => onChange(key)}
          className={cx(
            'press flex h-9 flex-1 items-center justify-center gap-1.5 rounded-bar text-body transition-colors duration-150',
            on ? 'bg-surface font-bold text-ink' : 'font-medium text-muted hover:text-ink',
          )}
        >
          <Icon aria-hidden className="size-4" />
          {text}
        </button>
      );
    })}
  </div>
);
