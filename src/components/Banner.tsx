import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { AlertTriangle, CloudOff, Info, XCircle } from 'lucide-react';
import { cx } from '../lib/cx';

export interface BannerProps {
  tone: 'info' | 'risk' | 'late' | 'offline';
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}

const TONES: Record<BannerProps['tone'], { cls: string; icon: LucideIcon; ink: string }> = {
  info: { cls: 'bg-navy-soft', icon: Info, ink: 'text-navy' },
  risk: { cls: 'bg-risk/15', icon: AlertTriangle, ink: 'text-risk-ink' },
  late: { cls: 'bg-late/10', icon: XCircle, ink: 'text-late-ink' },
  offline: { cls: 'bg-ink text-surface', icon: CloudOff, ink: 'text-surface' },
};

/** Inline message with an icon and a title that says what happened. Full tint, no side stripe. */
export const Banner = ({ tone, title, children, action }: BannerProps) => {
  const { cls, icon: Icon, ink } = TONES[tone];
  return (
    <div role={tone === 'late' ? 'alert' : 'status'} className={cx('flex gap-3 rounded-control p-3', cls)}>
      <Icon aria-hidden className={cx('mt-0.5 size-5 shrink-0', ink)} strokeWidth={2.25} />
      <div className="min-w-0 flex-1">
        <p className={cx('text-body font-bold', ink)}>{title}</p>
        {children && <div className={cx('mt-0.5 text-body', tone === 'offline' ? 'text-surface/80' : 'text-ink')}>{children}</div>}
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
};
