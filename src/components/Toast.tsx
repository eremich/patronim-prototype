import { CheckCircle2, AlertTriangle } from 'lucide-react';

export interface ToastProps {
  message: string;
  tone?: 'ok' | 'error';
}

/** Short confirmation that repeats the action's name ("Mark as ready" → "Marked as ready") */
export const Toast = ({ message, tone = 'ok' }: ToastProps) => {
  const Icon = tone === 'ok' ? CheckCircle2 : AlertTriangle;
  return (
    <div role="status" className="toast-enter flex items-center gap-2.5 rounded-control bg-ink px-4 py-3 text-body font-medium text-surface shadow-toast">
      <Icon aria-hidden className={tone === 'ok' ? 'size-5 text-ok' : 'size-5 text-late'} strokeWidth={2.5} />
      {message}
    </div>
  );
};
