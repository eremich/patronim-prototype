import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, CheckCircle2, Circle, Clock, XCircle } from 'lucide-react';
import { cx } from '../lib/cx';

export type BadgeTone = 'ok' | 'risk' | 'late' | 'brand' | 'neutral';

export interface StatusBadgeProps {
  label: string;
  tone: BadgeTone;
  /** Defaults to the tone's icon. Status is never color alone. */
  icon?: LucideIcon;
  size?: 'sm' | 'md';
}

const TONES: Record<BadgeTone, { cls: string; icon: LucideIcon }> = {
  ok: { cls: 'bg-ok/10 text-ok-ink', icon: CheckCircle2 },
  risk: { cls: 'bg-risk/15 text-risk-ink', icon: AlertTriangle },
  late: { cls: 'bg-late/10 text-late-ink', icon: XCircle },
  brand: { cls: 'bg-navy-soft text-navy', icon: Clock },
  neutral: { cls: 'bg-canvas text-muted border border-line', icon: Circle },
};

export const StatusBadge = ({ label, tone, icon, size = 'md' }: StatusBadgeProps) => {
  const Icon = icon ?? TONES[tone].icon;
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-chip font-bold',
        size === 'md' ? 'h-7 px-2.5 text-caption' : 'h-6 px-2 text-caption',
        TONES[tone].cls,
      )}
    >
      <Icon aria-hidden className="size-3.5" strokeWidth={2.5} />
      {label}
    </span>
  );
};
