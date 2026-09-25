import type { Health, Job } from '../data/types';
import { NOW, roundUpTo, type Minutes } from './time';

/** Time an inspector needs after the clean */
export const INSPECTION_MIN = 30;
/** Time a cleaner needs to fix sent-back items */
export const REWORK_MIN = 20;

export const itemsProgress = (job: Job) => {
  const all = job.rooms.flatMap((r) => r.items);
  const done = all.filter((i) => i.done).length;
  return { done, total: all.length, fraction: all.length ? done / all.length : 0 };
};

export const roomDone = (r: Job['rooms'][number]) => r.items.every((i) => i.done) && !!r.photo;

export const roomsProgress = (job: Job) => ({
  done: job.rooms.filter(roomDone).length,
  total: job.rooms.length,
});

/** When cleaning is expected to end */
export function projectedFinish(job: Job): Minutes {
  switch (job.status) {
    case 'scheduled':
      return job.start + job.durationMin;
    case 'cleaning': {
      const left = 1 - itemsProgress(job).fraction;
      return roundUpTo(NOW + job.durationMin * left, 5);
    }
    case 'rework':
      return NOW + REWORK_MIN;
    default:
      return NOW;
  }
}

/** When the apartment is expected to be ready for the guest (cleaning + inspection) */
export function projectedReady(job: Job): Minutes {
  if (job.status === 'ready') return NOW;
  if (job.status === 'inspection') return NOW + INSPECTION_MIN;
  return projectedFinish(job) + INSPECTION_MIN;
}

export function health(job: Job): Health {
  if (job.status === 'ready') return 'ok';
  if (projectedFinish(job) > job.checkin) return 'late';
  if (projectedReady(job) > job.checkin) return 'risk';
  return 'ok';
}

/** Planned start for a new booking: checkout, or the next half hour if checkout has passed */
export const plannedStart = (checkout: Minutes) => Math.max(checkout, roundUpTo(NOW + 15, 30));

export interface WindowCheck {
  fits: boolean;
  needed: number;
  available: number;
  earliestCheckin: Minutes;
}

/** Does the service (+ inspection) fit between start and guest check-in? */
export function checkWindow(start: Minutes, checkin: Minutes, durationMin: number): WindowCheck {
  const needed = durationMin + INSPECTION_MIN;
  const available = checkin - start;
  return { fits: available >= needed, needed, available, earliestCheckin: roundUpTo(start + needed, 30) };
}
