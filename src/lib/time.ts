/**
 * All times are minutes since the mock day start (Thu 1 Oct 2026, 00:00).
 * The clock is frozen so every screenshot renders the same.
 */
export type Minutes = number;

export const MIN_PER_DAY = 1440;
export const START_NOW: Minutes = 11 * 60 + 40;

/**
 * Current mock time. Frozen per scenario, and nudged forward by the end-to-end story
 * (a clean takes hours, an inspection minutes) so the "now" marker moves along the window.
 * ES module live binding: importers always read the latest value.
 */
export let NOW: Minutes = START_NOW;
export const setNow = (t: Minutes) => {
  NOW = t;
};

const DAY_NAMES = ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'];
const FIRST_DATE = 1; // 1 Oct

export const at = (day: number, hh: number, mm = 0): Minutes => day * MIN_PER_DAY + hh * 60 + mm;

export const dayOf = (t: Minutes) => Math.floor(t / MIN_PER_DAY);

export const clock = (t: Minutes) => {
  const m = ((t % MIN_PER_DAY) + MIN_PER_DAY) % MIN_PER_DAY;
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
};

export const dayLabel = (day: number) => {
  if (day === 0) return 'Today';
  if (day === 1) return 'Tomorrow';
  return `${DAY_NAMES[day % 7]} ${FIRST_DATE + day} Oct`;
};

export const shortDay = (day: number) => `${DAY_NAMES[day % 7]} ${FIRST_DATE + day}`;

/** "Today 15:00" / "Sat 3 Oct 15:00" */
export const when = (t: Minutes) => `${dayLabel(dayOf(t))} ${clock(t)}`;

/** "3 h 10 min" / "45 min" / "2 h" */
export const duration = (mins: number) => {
  const m = Math.max(0, Math.round(mins));
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h === 0) return `${r} min`;
  if (r === 0) return `${h} h`;
  return `${h} h ${r} min`;
};

export const roundUpTo = (t: Minutes, step: number) => Math.ceil(t / step) * step;

/** Half-hour options for a day, used by time pickers */
export const halfHours = (from = 6, to = 22) => {
  const out: number[] = [];
  for (let h = from; h <= to; h++) out.push(h * 60, h * 60 + 30);
  return out.filter((m) => m <= to * 60);
};
