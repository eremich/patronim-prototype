import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, CheckCircle2, ClipboardCheck, Clock, RotateCcw, Sparkles } from 'lucide-react';
import type { Job } from '../data/types';
import type { BadgeTone } from '../components/StatusBadge';
import { health } from './health';

export interface StatusView {
  label: string;
  tone: BadgeTone;
  icon: LucideIcon;
}

const BASE: Record<Job['status'], StatusView> = {
  scheduled: { label: 'Scheduled', tone: 'brand', icon: Clock },
  cleaning: { label: 'Cleaning', tone: 'brand', icon: Sparkles },
  inspection: { label: 'Inspection', tone: 'brand', icon: ClipboardCheck },
  rework: { label: 'Rework in progress', tone: 'risk', icon: RotateCcw },
  ready: { label: 'Ready', tone: 'ok', icon: CheckCircle2 },
};

/** Manager-facing status. Health overrides the stage when the deadline is in danger. */
export function statusView(job: Job): StatusView {
  const h = health(job);
  if (job.status !== 'ready' && job.status !== 'rework' && h !== 'ok') {
    return { label: 'At risk', tone: h === 'late' ? 'late' : 'risk', icon: AlertTriangle };
  }
  return BASE[job.status];
}

export const stageView = (job: Job) => BASE[job.status];
