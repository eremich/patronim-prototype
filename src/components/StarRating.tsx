import { Star } from 'lucide-react';
import { cx } from '../lib/cx';

export interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  label?: string;
}

const WORDS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

/** 1–5 rating as a radio group; each star is a 48px target */
export const StarRating = ({ value, onChange, label = 'Rating' }: StarRatingProps) => (
  <div>
    <div role="radiogroup" aria-label={label} className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const on = n <= value;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === value}
            aria-label={`${n} of 5, ${WORDS[n].toLowerCase()}`}
            disabled={!onChange}
            onClick={() => onChange?.(n)}
            className="press flex size-12 items-center justify-center rounded-control hover:bg-navy-soft"
          >
            <Star aria-hidden className={cx('size-8 transition-colors duration-150', on ? 'fill-navy text-navy' : 'text-line')} strokeWidth={1.75} />
          </button>
        );
      })}
    </div>
    <p aria-live="polite" className="mt-1 h-5 text-body font-medium text-muted">
      {WORDS[value]}
    </p>
  </div>
);
