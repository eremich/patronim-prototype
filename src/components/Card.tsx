import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'article' | 'li';
  padded?: boolean;
  tone?: 'default' | 'late' | 'risk' | 'brand';
  children: ReactNode;
}

const TONES = {
  default: 'border-line',
  late: 'border-late/40',
  risk: 'border-risk/50',
  brand: 'border-navy/30',
};

/** Cards sit flat on canvas with a hairline border. No shadow. */
export const Card = ({ as: Tag = 'div', padded = true, tone = 'default', className, children, ...rest }: CardProps) => (
  <Tag className={cx('rounded-card border bg-surface', TONES[tone], padded && 'p-4', className)} {...rest}>
    {children}
  </Tag>
);
