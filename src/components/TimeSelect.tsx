import { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cx } from '../lib/cx';
import { clock } from '../lib/time';

export interface TimeSelectProps {
  label: string;
  /** Minutes within the day, or null when not set */
  value: number | null;
  options: number[];
  onChange: (value: number) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
  hint?: string;
}

/** Native select styled as a field, so phones get their own time wheel */
export const TimeSelect = ({ label, value, options, onChange, required, placeholder = 'Choose time', error, hint }: TimeSelectProps) => {
  const id = useId();
  const msgId = `${id}-msg`;
  return (
    <div className="flex-1">
      <label htmlFor={id} className="mb-1.5 flex items-center gap-2 text-caption font-bold text-ink">
        {label}
        {required && <span className="rounded-chip bg-navy-soft px-2 py-0.5 text-caption font-bold text-navy">Required</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value ?? ''}
          required={required}
          aria-invalid={!!error || undefined}
          aria-describedby={error || hint ? msgId : undefined}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cx(
            'tnum h-13 w-full appearance-none rounded-control border bg-surface pl-4 pr-10 text-headline font-medium transition-colors duration-150 focus-visible:border-navy',
            error ? 'border-late' : 'border-line hover:border-navy/40',
            value === null ? 'text-muted' : 'text-ink',
          )}
        >
          {value === null && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((m) => (
            <option key={m} value={m}>
              {clock(m)}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-muted" />
      </div>
      {(error || hint) && (
        <p id={msgId} className={cx('mt-1.5 text-caption', error ? 'font-medium text-late-ink' : 'text-muted')}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
};
