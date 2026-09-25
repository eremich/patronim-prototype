import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { LoaderCircle } from 'lucide-react';
import { cx } from '../lib/cx';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'md' | 'lg';
  icon?: ReactNode;
  trailing?: ReactNode;
  loading?: boolean;
  block?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-navy text-surface hover:bg-navy-deep disabled:bg-line disabled:text-muted',
  secondary: 'bg-surface text-navy border border-line hover:bg-navy-soft disabled:text-muted',
  ghost: 'bg-transparent text-navy hover:bg-navy-soft disabled:text-muted',
  danger: 'bg-surface text-late-ink border border-line hover:bg-late/5 disabled:text-muted',
};

export const Button = ({
  variant = 'primary',
  size = 'lg',
  icon,
  trailing,
  loading = false,
  block = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) => (
  <button
    type="button"
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    className={cx(
      'press inline-flex items-center justify-center gap-2 rounded-control font-bold transition-colors duration-150 disabled:cursor-not-allowed',
      size === 'lg' ? 'min-h-13 px-5 text-headline' : 'min-h-11 px-4 text-body',
      block && 'w-full',
      VARIANTS[variant],
      className,
    )}
    {...rest}
  >
    {loading ? <LoaderCircle aria-hidden className="size-5 animate-spin" /> : icon}
    {children}
    {!loading && trailing}
  </button>
);
