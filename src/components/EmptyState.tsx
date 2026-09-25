import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: ReactNode;
}

/** Empty states point to the next action, not "nothing here" */
export const EmptyState = ({ icon: Icon, title, body, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center px-6 py-12 text-center">
    <span className="mb-4 flex size-16 items-center justify-center rounded-chip bg-navy-soft text-navy">
      <Icon aria-hidden className="size-7" strokeWidth={1.75} />
    </span>
    <h2 className="text-headline font-bold text-ink">{title}</h2>
    <p className="mt-1 max-w-[30ch] text-body text-muted">{body}</p>
    {action && <div className="mt-6 w-full">{action}</div>}
  </div>
);
