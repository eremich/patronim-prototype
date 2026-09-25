import { makeRooms, REDO_PHOTO, ROOM_PHOTOS } from './catalog';
import type { Extras, Job, Room, Scenario, ServiceId } from './types';
import { at } from '../lib/time';

export interface Draft {
  propertyId: string;
  serviceId: ServiceId;
  day: number;
  /** Minutes within the day */
  checkout: number;
  checkin: number | null;
  extras: Extras;
  note: string;
  payment: 'card' | 'paypal' | 'invoice';
}

export const emptyDraft = (): Draft => ({
  propertyId: 'ben-yehuda',
  serviceId: 'turnover',
  day: 0,
  checkout: 11 * 60,
  checkin: null,
  extras: { linen: 0, towels: 0, kit: 1 },
  note: '',
  payment: 'card',
});

/** Rooms with the first `doneRooms` fully cleaned and photographed, plus `partial` items in the next one */
const roomsDone = (doneRooms: number, partial = 0): Room[] =>
  makeRooms().map((r, i) => {
    if (i < doneRooms) return { ...r, photo: ROOM_PHOTOS[r.id], items: r.items.map((it) => ({ ...it, done: true })) };
    if (i === doneRooms) return { ...r, items: r.items.map((it, k) => ({ ...it, done: k < partial })) };
    return r;
  });

const passAll = (rooms: Room[]): Room[] => rooms.map((r) => ({ ...r, items: r.items.map((it) => ({ ...it, mark: 'pass' as const })) }));

const base = (j: Partial<Job> & Pick<Job, 'id' | 'propertyId' | 'serviceId' | 'checkout' | 'checkin' | 'start' | 'durationMin' | 'status'>): Job => ({
  extras: { linen: 0, towels: 0, kit: 0 },
  note: '',
  rooms: makeRooms(),
  patronId: 'avi',
  inspectorId: 'noa',
  price: 0,
  missing: [],
  reworkCount: 0,
  ...j,
});

const defaultJobs = (): Job[] => [
  base({
    id: 'j-bograshov',
    propertyId: 'bograshov',
    serviceId: 'turnover',
    checkout: at(0, 10),
    checkin: at(0, 15),
    start: at(0, 10, 15),
    durationMin: 210,
    status: 'cleaning',
    rooms: roomsDone(3, 2),
    extras: { linen: 3, towels: 3, kit: 1 },
    price: 571,
    note: 'Guests left a stroller in the hallway. Please leave it by the door.',
  }),
  base({
    id: 'j-hayarkon',
    propertyId: 'hayarkon',
    serviceId: 'turnover',
    checkout: at(0, 11),
    checkin: at(0, 14, 15),
    start: at(0, 12),
    durationMin: 120,
    status: 'scheduled',
    extras: { linen: 1, towels: 2, kit: 1 },
    price: 432,
    note: 'Early check-in guest. Start with the bedroom.',
  }),
  base({
    id: 'j-levinski',
    propertyId: 'levinski',
    serviceId: 'refresh',
    checkout: at(0, 10),
    checkin: at(0, 16),
    start: at(0, 10, 30),
    durationMin: 45,
    status: 'inspection',
    rooms: roomsDone(4),
    patronId: 'yossi',
    price: 170,
  }),
  base({
    id: 'j-weizmann',
    propertyId: 'weizmann',
    serviceId: 'turnover',
    checkout: at(0, 9),
    checkin: at(0, 14),
    start: at(0, 9, 15),
    durationMin: 120,
    status: 'ready',
    rooms: passAll(roomsDone(4)),
    price: 347,
  }),
  base({
    id: 'j-bograshov-sat',
    propertyId: 'bograshov',
    serviceId: 'midstay-linen',
    checkout: at(2, 10),
    checkin: at(2, 14),
    start: at(2, 10),
    durationMin: 165,
    status: 'scheduled',
    price: 358,
  }),
];

/** The job from the end-to-end story (77 Ben Yehuda) at a given stage */
const benYehuda = (stage: 'rework' | 'ready'): Job => {
  const rooms = passAll(roomsDone(4)).map((r) =>
    r.id !== 'bathroom' || stage === 'ready'
      ? r
      : {
          ...r,
          items: r.items.map((it) =>
            it.label === 'Polish mirror'
              ? { ...it, mark: 'redo' as const, redoNote: 'Streaks on the mirror above the sink. Please polish it again with the glass cloth.', redoPhoto: REDO_PHOTO }
              : it,
          ),
        },
  );
  return base({
    id: 'j-benyehuda',
    propertyId: 'ben-yehuda',
    serviceId: 'turnover',
    checkout: at(0, 11),
    checkin: at(0, 15),
    start: at(0, 11, 40),
    durationMin: 150,
    status: stage,
    rooms,
    extras: { linen: 0, towels: 0, kit: 1 },
    price: 432,
    missing: [{ id: 'm1', type: 'Towel', quantity: 1, at: at(0, 11, 20) }],
    reworkCount: 1,
    finishedAt: stage === 'ready' ? at(0, 14, 5) : at(0, 13, 55),
  });
};

export interface Seed {
  jobs: Job[];
  draft: Draft;
  paymentFails: boolean;
  offline: boolean;
  /** Clock for the scenario, when it isn't the default 11:40 */
  now?: number;
}

export function seed(s: Scenario): Seed {
  const draft = emptyDraft();
  switch (s) {
    case 'empty':
      return { jobs: [], draft, paymentFails: false, offline: false };
    case 'at-risk': {
      const jobs = defaultJobs().map((j) =>
        j.id === 'j-bograshov' ? { ...j, checkin: at(0, 13, 30), rooms: roomsDone(1, 3) } : j,
      );
      return { jobs, draft: { ...draft, checkin: 13 * 60 + 30 }, paymentFails: false, offline: true };
    }
    case 'rework':
      return { jobs: [benYehuda('rework'), ...defaultJobs()], draft, paymentFails: false, offline: false };
    case 'ready':
      return { jobs: [benYehuda('ready'), ...defaultJobs()], draft, paymentFails: false, offline: false, now: at(0, 14, 40) };
    case 'payment-error':
      return { jobs: defaultJobs(), draft: { ...draft, checkin: 15 * 60 }, paymentFails: true, offline: false };
    default:
      return { jobs: defaultJobs(), draft, paymentFails: false, offline: false };
  }
}

export const SCENARIOS: Scenario[] = ['default', 'empty', 'at-risk', 'rework', 'payment-error', 'ready'];
