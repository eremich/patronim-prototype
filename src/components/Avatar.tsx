import { cx } from '../lib/cx';

export interface AvatarProps {
  initials: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = { sm: 'size-8 text-caption', md: 'size-11 text-body', lg: 'size-14 text-headline' };

export const Avatar = ({ initials, name, size = 'md' }: AvatarProps) => (
  <span role="img" aria-label={name} className={cx('inline-flex shrink-0 items-center justify-center rounded-chip bg-navy-soft font-bold text-navy', SIZES[size])}>
    {initials}
  </span>
);
