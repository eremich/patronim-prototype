import { useEffect } from 'react';
import { propertyById, propertyTitle, serviceById } from '../data/catalog';
import type { Job } from '../data/types';
import { health, projectedFinish, itemsProgress } from '../lib/health';
import type { TurnoverWindowBarProps } from '../components/TurnoverWindowBar';
import { NOW } from '../lib/time';
import { useStore } from '../store/useStore';

export const LOADING_MS = 600;

/** Shows a skeleton the first time a screen opens in a session (simulated fetch) */
export function useFirstLoad(key: string) {
  const loaded = useStore((s) => !!s.loaded[key]);
  const markLoaded = useStore((s) => s.markLoaded);
  useEffect(() => {
    if (loaded) return;
    const t = setTimeout(() => markLoaded(key), LOADING_MS);
    return () => clearTimeout(t);
  }, [loaded, key, markLoaded]);
  return !loaded;
}

export const useJob = (id?: string) => useStore((s) => s.jobs.find((j) => j.id === id));

/** End of cleaning: planned, projected, or actual once submitted */
export const finishOf = (job: Job) => {
  if (job.status === 'scheduled') return job.start + job.durationMin;
  if (job.status === 'inspection' || job.status === 'ready') return job.finishedAt ?? Math.min(job.start + job.durationMin, NOW);
  return Math.max(projectedFinish(job), job.start + 15);
};

/** Props for the window bar derived from a job */
export const windowProps = (job: Job): TurnoverWindowBarProps => ({
  checkout: job.checkout,
  checkin: job.checkin,
  start: job.start,
  finish: finishOf(job),
  now: NOW,
  health: health(job),
  progress: itemsProgress(job).fraction,
  phase: job.status === 'rework' ? 'cleaning' : job.status,
});

export const jobTitle = (job: Job) => propertyTitle(propertyById(job.propertyId));
export const jobService = (job: Job) => serviceById(job.serviceId);
export const jobProperty = (job: Job) => propertyById(job.propertyId);
