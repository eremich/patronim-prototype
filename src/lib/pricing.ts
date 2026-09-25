import { EXTRA_PRICES, EXTRA_LABELS } from '../data/catalog';
import type { Extras, Property, Service } from '../data/types';
import { MIN_PER_DAY, NOW, dayOf, type Minutes } from './time';

/** Holiday week in the mock calendar: Thu 1 – Sat 3 Oct (Sukkot) */
export const HOLIDAY_DAYS = [0, 1, 2];
export const HOLIDAY_RATE = 0.2;
export const SHORT_NOTICE_RATE = 0.15;
export const SHORT_NOTICE_HOURS = 24;

const SIZE_PRICE = [0.65, 0.83, 1, 1.24];
const SIZE_TIME = [0.6, 0.8, 1, 1.4];

const roundTo = (n: number, step: number) => Math.round(n / step) * step;

export const servicePrice = (s: Service, p: Property) =>
  s.id === 'linen-only' ? s.basePrice2br : roundTo(s.basePrice2br * SIZE_PRICE[Math.min(p.bedrooms, 3)], 5);

export const serviceDuration = (s: Service, p: Property) =>
  roundTo(s.duration2br * SIZE_TIME[Math.min(p.bedrooms, 3)], 15);

export interface PriceLine {
  label: string;
  detail?: string;
  amount: number;
}

export interface Quote {
  base: PriceLine;
  extras: PriceLine[];
  adjustments: PriceLine[];
  total: number;
}

export function quote(s: Service, p: Property, extras: Extras, start: Minutes): Quote {
  const base: PriceLine = { label: s.name, detail: sizeHint(p), amount: servicePrice(s, p) };
  const extraLines: PriceLine[] = (Object.keys(extras) as (keyof Extras)[])
    .filter((k) => extras[k] > 0)
    .map((k) => ({
      label: `${EXTRA_LABELS[k].name} × ${extras[k]}`,
      amount: extras[k] * EXTRA_PRICES[k],
    }));
  const subtotal = base.amount + extraLines.reduce((a, l) => a + l.amount, 0);

  const adjustments: PriceLine[] = [];
  if (HOLIDAY_DAYS.includes(dayOf(start))) {
    adjustments.push({
      label: 'Holiday week +20%',
      detail: 'Sukkot runs until Saturday. More bookings, fewer cleaners.',
      amount: Math.round(subtotal * HOLIDAY_RATE),
    });
  }
  if (start - NOW < SHORT_NOTICE_HOURS * 60) {
    adjustments.push({
      label: 'Booked less than 24 h ahead +15%',
      detail: 'We move a cleaner from another job to fit you in.',
      amount: Math.round(subtotal * SHORT_NOTICE_RATE),
    });
  }
  const total = subtotal + adjustments.reduce((a, l) => a + l.amount, 0);
  return { base, extras: extraLines, adjustments, total };
}

/** Same booking moved to the first calm day (Sunday morning), if cheaper */
export function cheaperOption(s: Service, p: Property, extras: Extras, start: Minutes) {
  const current = quote(s, p, extras, start).total;
  const sunday = 3 * MIN_PER_DAY + 9 * 60;
  const alt = quote(s, p, extras, sunday).total;
  return alt < current ? { label: 'Sunday morning', save: current - alt } : null;
}

const sizeHint = (p: Property) => (p.bedrooms === 0 ? 'Studio' : `${p.bedrooms} bedroom${p.bedrooms > 1 ? 's' : ''}`);

export const money = (n: number) => `₪${n.toLocaleString('en-US')}`;
