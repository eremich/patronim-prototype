import { cx } from '../lib/cx';

export interface SkeletonProps {
  className?: string;
}

/** Placeholder block while content loads. Pulses opacity only. */
export const Skeleton = ({ className }: SkeletonProps) => <div aria-hidden className={cx('skeleton rounded-control bg-line/70', className)} />;

/** A list-card-shaped skeleton used on Today and Jobs */
export const SkeletonCard = () => (
  <div aria-hidden className="rounded-card border border-line bg-surface p-4">
    <div className="flex justify-between gap-4">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-6 w-20 rounded-chip" />
    </div>
    <Skeleton className="mt-2 h-4 w-28" />
    <Skeleton className="mt-4 h-3 w-full rounded-bar" />
  </div>
);
