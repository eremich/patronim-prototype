import { Minus, Plus } from 'lucide-react';

export interface StepperProps {
  label: string;
  hint?: string;
  /** e.g. "₪45 each" */
  price?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

const stepBtn =
  'press flex size-11 items-center justify-center rounded-control border border-line bg-surface text-navy transition-colors duration-150 hover:bg-navy-soft disabled:text-line disabled:hover:bg-surface';

export const Stepper = ({ label, hint, price, value, min = 0, max = 9, onChange }: StepperProps) => (
  <div className="flex items-center gap-3 py-2">
    <div className="min-w-0 flex-1">
      <div className="text-body font-medium text-ink">{label}</div>
      <div className="text-caption text-muted">
        {hint}
        {hint && price && ' · '}
        {price && <span className="tnum">{price}</span>}
      </div>
    </div>
    <div className="flex items-center gap-1" role="group" aria-label={label}>
      <button type="button" className={stepBtn} aria-label={`Fewer ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(value - 1)}>
        <Minus aria-hidden className="size-4" strokeWidth={2.5} />
      </button>
      <output aria-live="polite" className="tnum w-8 text-center text-headline font-bold">
        {value}
      </output>
      <button type="button" className={stepBtn} aria-label={`More ${label.toLowerCase()}`} disabled={value >= max} onClick={() => onChange(value + 1)}>
        <Plus aria-hidden className="size-4" strokeWidth={2.5} />
      </button>
    </div>
  </div>
);
