import { useId } from 'react';

export interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  rows?: number;
}

export const TextArea = ({ label, value, onChange, placeholder, hint, rows = 3 }: TextAreaProps) => {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-caption font-bold text-ink">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-control border border-line bg-surface px-4 py-3 text-body text-ink transition-colors duration-150 placeholder:text-muted hover:border-navy/40 focus-visible:border-navy"
      />
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-caption text-muted">
          {hint}
        </p>
      )}
    </div>
  );
};
