import { create } from 'zustand';
import { makeRooms, propertyById, serviceById } from '../data/catalog';
import { seed, type Draft } from '../data/scenarios';
import type { InspectionMark, Job, MissingItem, Role, Scenario } from '../data/types';
import { plannedStart } from '../lib/health';
import { quote, serviceDuration } from '../lib/pricing';
import { MIN_PER_DAY, NOW, START_NOW, setNow } from '../lib/time';
import { applyTheme, saveTheme, type ThemeChoice } from '../lib/theme';

export interface ToastMsg {
  id: number;
  message: string;
  tone: 'ok' | 'error';
}

interface State {
  scenario: Scenario;
  role: Role;
  /** Mirrors lib/time NOW so the UI re-renders when the clock moves */
  now: number;
  jobs: Job[];
  draft: Draft;
  paymentFails: boolean;
  offline: boolean;
  toasts: ToastMsg[];
  /** Screens that already showed their loading skeleton */
  loaded: Record<string, boolean>;
  roleSheetOpen: boolean;
  theme: ThemeChoice;
  setTheme: (t: ThemeChoice, persist?: boolean) => void;

  loadScenario: (s: Scenario) => void;
  setRole: (r: Role) => void;
  setRoleSheet: (open: boolean) => void;
  toast: (message: string, tone?: ToastMsg['tone']) => void;
  markLoaded: (key: string) => void;
  setOffline: (v: boolean) => void;

  // Manager
  setDraft: (patch: Partial<Draft>) => void;
  createBooking: () => string;
  rate: (jobId: string, rating: number, comment: string) => void;

  // Patron
  startJob: (jobId: string) => void;
  toggleItem: (jobId: string, roomId: string, itemId: string) => void;
  addPhoto: (jobId: string, roomId: string, photo: string) => void;
  reportMissing: (jobId: string, item: Omit<MissingItem, 'id' | 'at'>) => void;
  submitForInspection: (jobId: string) => void;
  markFixed: (jobId: string, itemId: string) => void;

  // Inspector
  markItem: (jobId: string, itemId: string, mark: InspectionMark, note?: string, photo?: string) => void;
  passRoom: (jobId: string, roomId: string) => void;
  markReady: (jobId: string) => void;
  sendBack: (jobId: string) => void;
}

let toastId = 0;
let jobSeq = 0;

const mapItems = (job: Job, fn: (it: Job['rooms'][number]['items'][number], roomId: string) => Job['rooms'][number]['items'][number]): Job => ({
  ...job,
  rooms: job.rooms.map((r) => ({ ...r, items: r.items.map((it) => fn(it, r.id)) })),
});

export const useStore = create<State>((set, get) => {
  const updateJob = (id: string, fn: (j: Job) => Job) => set((s) => ({ jobs: s.jobs.map((j) => (j.id === id ? fn(j) : j)) }));
  const advance = (to: number) => {
    setNow(Math.max(NOW, to));
    set({ now: NOW });
  };
  const jobOf = (id: string) => get().jobs.find((j) => j.id === id)!;

  return {
    scenario: 'default',
    role: 'manager',
    now: START_NOW,
    ...seed('default'),
    toasts: [],
    loaded: {},
    roleSheetOpen: false,
    theme: 'system',
    setTheme: (theme, persist = true) => {
      applyTheme(theme);
      if (persist) saveTheme(theme);
      set({ theme });
    },

    loadScenario: (scenario) => {
      const { now = START_NOW, ...rest } = seed(scenario);
      setNow(now);
      set({ scenario, now, ...rest, loaded: {}, toasts: [] });
    },
    setRole: (role) => set({ role, roleSheetOpen: false }),
    setRoleSheet: (roleSheetOpen) => set({ roleSheetOpen }),
    toast: (message, tone = 'ok') => {
      const id = ++toastId;
      set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }));
      setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 2800);
    },
    markLoaded: (key) => set((s) => ({ loaded: { ...s.loaded, [key]: true } })),
    setOffline: (offline) => set({ offline }),

    setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),

    createBooking: () => {
      const { draft } = get();
      const p = propertyById(draft.propertyId);
      const svc = serviceById(draft.serviceId);
      const dayStart = draft.day * MIN_PER_DAY;
      const checkout = dayStart + draft.checkout;
      const start = draft.day === 0 ? plannedStart(checkout) : checkout;
      const id = `j-new-${++jobSeq}`;
      const job: Job = {
        id,
        propertyId: p.id,
        serviceId: svc.id,
        checkout,
        checkin: dayStart + (draft.checkin ?? draft.checkout + 240),
        start,
        durationMin: serviceDuration(svc, p),
        extras: { ...draft.extras },
        note: draft.note,
        status: 'scheduled',
        rooms: svc.hasRooms ? makeRooms() : [],
        patronId: 'avi',
        inspectorId: 'noa',
        price: quote(svc, p, draft.extras, start).total,
        missing: [],
        reworkCount: 0,
      };
      set((s) => ({ jobs: [job, ...s.jobs] }));
      return id;
    },

    rate: (jobId, rating, comment) => updateJob(jobId, (j) => ({ ...j, rating, comment })),

    startJob: (jobId) => updateJob(jobId, (j) => ({ ...j, status: 'cleaning', start: Math.min(j.start, NOW) })),

    toggleItem: (jobId, roomId, itemId) =>
      updateJob(jobId, (j) => mapItems(j, (it, rid) => (rid === roomId && it.id === itemId ? { ...it, done: !it.done } : it))),

    addPhoto: (jobId, roomId, photo) =>
      updateJob(jobId, (j) => ({ ...j, rooms: j.rooms.map((r) => (r.id === roomId ? { ...r, photo } : r)) })),

    reportMissing: (jobId, item) =>
      updateJob(jobId, (j) => ({ ...j, missing: [...j.missing, { ...item, id: `m${Date.now()}`, at: NOW }] })),

    submitForInspection: (jobId) => {
      const j0 = jobOf(jobId);
      // First submit: the clean took its planned time. Resubmit: a short fix.
      advance(j0.reworkCount === 0 ? j0.start + j0.durationMin - 10 : NOW + 15);
      updateJob(jobId, (j) => ({
        ...mapItems(j, (it) => (it.mark === 'redo' && it.fixed ? { ...it, mark: undefined } : it)),
        finishedAt: NOW,
        status: 'inspection',
      }));
    },

    markFixed: (jobId, itemId) => updateJob(jobId, (j) => mapItems(j, (it) => (it.id === itemId ? { ...it, fixed: !it.fixed } : it))),

    markItem: (jobId, itemId, mark, note, photo) =>
      updateJob(jobId, (j) =>
        mapItems(j, (it) =>
          it.id === itemId ? { ...it, mark, redoNote: mark === 'redo' ? note : undefined, redoPhoto: mark === 'redo' ? photo : undefined, fixed: mark === 'pass' ? it.fixed : false } : it,
        ),
      ),

    passRoom: (jobId, roomId) => updateJob(jobId, (j) => mapItems(j, (it, rid) => (rid === roomId && !it.mark ? { ...it, mark: 'pass' } : it))),

    markReady: (jobId) => {
      advance(NOW + 10);
      updateJob(jobId, (j) => ({ ...j, status: 'ready', finishedAt: j.finishedAt ?? NOW }));
    },

    sendBack: (jobId) => {
      advance(NOW + 15);
      updateJob(jobId, (j) => ({ ...j, status: 'rework', reworkCount: j.reworkCount + 1 }));
    },
  };
});

/** Items the inspector sent back that the cleaner still has to fix */
export const redoItems = (job: Job) =>
  job.rooms.flatMap((r) => r.items.filter((it) => it.mark === 'redo').map((it) => ({ ...it, roomId: r.id, roomName: r.name })));
