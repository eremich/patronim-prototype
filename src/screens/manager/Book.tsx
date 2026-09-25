import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, ChevronUp, Clock } from 'lucide-react';
import { Banner } from '../../components/Banner';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionTitle } from '../../components/SectionTitle';
import { Sheet } from '../../components/Sheet';
import { Stepper } from '../../components/Stepper';
import { TextArea } from '../../components/TextArea';
import { TimeSelect } from '../../components/TimeSelect';
import { TurnoverWindowBar } from '../../components/TurnoverWindowBar';
import { EXTRA_LABELS, EXTRA_PRICES, PROPERTIES, SERVICES, propertyById, propertyTitle, serviceById, sizeLabel } from '../../data/catalog';
import type { Extras } from '../../data/types';
import { checkWindow, plannedStart } from '../../lib/health';
import { cheaperOption, money, quote, serviceDuration, servicePrice } from '../../lib/pricing';
import { MIN_PER_DAY, NOW, clock, duration, halfHours, shortDay } from '../../lib/time';
import { cx } from '../../lib/cx';
import { useStore } from '../../store/useStore';
import { PriceSheet } from './PriceSheet';

const DAYS = [0, 1, 2, 3];
const DAY_NAMES = ['Today', 'Tomorrow', 'Sat', 'Sun'];

/** Everything the booking screens compute from the draft */
export const useBooking = () => {
  const draft = useStore((s) => s.draft);
  const p = propertyById(draft.propertyId);
  const svc = serviceById(draft.serviceId);
  const dayStart = draft.day * MIN_PER_DAY;
  const checkout = dayStart + draft.checkout;
  const start = draft.day === 0 ? plannedStart(checkout) : checkout;
  const dur = serviceDuration(svc, p);
  const checkin = draft.checkin === null ? null : dayStart + draft.checkin;
  const fit = checkin === null ? null : checkWindow(start, checkin, dur);
  const q = quote(svc, p, draft.extras, start);
  const cheaper = cheaperOption(svc, p, draft.extras, start);
  return { draft, p, svc, dayStart, checkout, start, dur, checkin, fit, q, cheaper };
};

export const Book = () => {
  const navigate = useNavigate();
  const setDraft = useStore((s) => s.setDraft);
  const { draft, p, svc, dayStart, checkout, start, dur, checkin, fit, q, cheaper } = useBooking();
  const [priceOpen, setPriceOpen] = useState(false);
  const [propOpen, setPropOpen] = useState(false);
  const [tried, setTried] = useState(false);

  // A shorter service that fits the window, offered as the earliest safe option
  const fitting =
    fit && !fit.fits && checkin !== null
      ? SERVICES.filter((s) => s.hasRooms && s.id !== svc.id)
          .sort((a, b) => b.duration2br - a.duration2br)
          .find((s) => checkWindow(start, checkin, serviceDuration(s, p)).fits)
      : undefined;

  const earliest = fit ? fit.earliestCheckin - dayStart : null;
  const outOfDay = earliest !== null && earliest > 22 * 60;
  const checkoutOptions = halfHours(6, 16);
  const checkinOptions = halfHours(8, 22).filter((m) => m > draft.checkout);

  const next = () => {
    if (draft.checkin === null) {
      setTried(true);
      const el = document.getElementById('timing');
      el?.closest('#screen')?.scrollTo({ top: el.offsetTop - 8, behavior: 'smooth' });
      return;
    }
    navigate('/m/review');
  };

  return (
    <div className="screen-enter flex flex-1 flex-col">
      <ScreenHeader title="Book a cleaning" onBack={() => navigate('/m')} backLabel="Today" />

      <div className="flex flex-col gap-8 px-4 pb-8 pt-2">
        {/* Property */}
        <section aria-labelledby="prop-h">
          <SectionTitle id="prop-h">Property</SectionTitle>
          <button
            type="button"
            onClick={() => setPropOpen(true)}
            className="press flex w-full items-center gap-3 rounded-card border border-line bg-surface p-3 text-left hover:border-navy/40"
          >
            <img src={p.photo} alt="" className="size-14 rounded-control object-cover" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-headline font-bold text-ink">{propertyTitle(p)}</span>
              <span className="block text-caption text-muted">{sizeLabel(p)}</span>
            </span>
            <span className="px-2 text-body font-bold text-navy">Change</span>
          </button>
        </section>

        {/* Service */}
        <section aria-labelledby="svc-h">
          <SectionTitle id="svc-h">Service</SectionTitle>
          <div role="radiogroup" aria-labelledby="svc-h" className="flex flex-col gap-2">
            {SERVICES.map((s) => {
              const on = s.id === svc.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setDraft({ serviceId: s.id })}
                  className={cx(
                    'press rounded-card border p-4 text-left transition-colors duration-150',
                    on ? 'border-navy bg-navy-soft/50 ring-1 ring-navy' : 'border-line bg-surface hover:border-navy/40',
                  )}
                >
                  <span className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className={cx('mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-chip border-2', on ? 'border-navy bg-navy' : 'border-line')}
                    >
                      {on && <span className="size-2 rounded-chip bg-surface" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-body font-bold text-ink">{s.name}</span>
                      <span className="block text-caption text-muted">{s.summary}</span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="tnum block text-body font-bold text-ink">{money(servicePrice(s, p))}</span>
                      <span className="tnum flex items-center justify-end gap-1 text-caption text-muted">
                        <Clock aria-hidden className="size-3" />
                        {duration(serviceDuration(s, p))}
                      </span>
                    </span>
                  </span>
                  {on && (
                    <ul className="ml-8 mt-3 flex flex-col gap-1">
                      {s.includes.map((inc) => (
                        <li key={inc} className="flex items-center gap-2 text-caption text-ink">
                          <Check aria-hidden className="size-3.5 text-ok" strokeWidth={3} />
                          {inc}
                        </li>
                      ))}
                    </ul>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Timing */}
        <section id="timing" aria-labelledby="time-h" className="scroll-mt-4">
          <SectionTitle id="time-h">Timing</SectionTitle>
          <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1">
            {DAYS.map((d) => (
              <Chip key={d} label={DAY_NAMES[d]} sublabel={d < 2 ? shortDay(d) : `${1 + d} Oct`} selected={draft.day === d} onClick={() => setDraft({ day: d })} />
            ))}
          </div>
          <div className="flex gap-3">
            <TimeSelect label="Guest checkout" value={draft.checkout} options={checkoutOptions} onChange={(v) => setDraft({ checkout: v })} />
            <TimeSelect
              label="Guest check-in"
              required
              value={draft.checkin}
              options={checkinOptions}
              onChange={(v) => setDraft({ checkin: v })}
              error={tried && draft.checkin === null ? 'Add the check-in time. It is the deadline for the clean.' : undefined}
            />
          </div>

          <Card className="mt-4">
            {checkin === null || !fit ? (
              <div className="py-2 text-center">
                <p className="text-body font-bold text-ink">When does the next guest arrive?</p>
                <p className="mt-1 text-body text-muted">Add the check-in time to see if the {svc.name.toLowerCase()} fits before they arrive.</p>
              </div>
            ) : (
              <TurnoverWindowBar
                checkout={checkout}
                checkin={checkin}
                start={start}
                finish={start + dur}
                now={draft.day === 0 ? NOW : undefined}
                health={fit.fits ? 'ok' : start + dur > checkin ? 'late' : 'risk'}
              />
            )}
          </Card>
          {draft.day === 0 && checkout < start && (
            <p className="tnum mt-2 text-caption text-muted">Guest has checked out. The earliest a cleaner can start is {clock(start)}.</p>
          )}

          {fit && !fit.fits && (
            <div className="mt-3">
              <Banner
                tone="risk"
                title="Not enough time before check-in"
                action={
                  <div className="flex flex-wrap gap-2">
                    {fitting && (
                      <Button size="md" variant="secondary" onClick={() => setDraft({ serviceId: fitting.id })}>
                        Switch to {fitting.name.toLowerCase()} ({duration(serviceDuration(fitting, p))})
                      </Button>
                    )}
                    {!outOfDay && earliest !== null && (
                      <Button size="md" variant="secondary" onClick={() => setDraft({ checkin: earliest })}>
                        Set check-in to {clock(earliest)}
                      </Button>
                    )}
                  </div>
                }
              >
                <span className="tnum">
                  This clean takes {duration(dur)} plus 30 min inspection. The window leaves {duration(Math.max(0, fit.available))}.{' '}
                  {!outOfDay && earliest !== null && <>Earliest safe check-in is {clock(earliest)}.</>}
                </span>
              </Banner>
            </div>
          )}
        </section>

        {/* Extras */}
        <section aria-labelledby="extras-h">
          <SectionTitle id="extras-h">Extras</SectionTitle>
          <Card padded={false} className="divide-y divide-line px-4">
            {(Object.keys(EXTRA_LABELS) as (keyof Extras)[]).map((k) => (
              <Stepper
                key={k}
                label={EXTRA_LABELS[k].name}
                hint={EXTRA_LABELS[k].hint}
                price={`${money(EXTRA_PRICES[k])} each`}
                value={draft.extras[k]}
                onChange={(v) => setDraft({ extras: { ...draft.extras, [k]: v } })}
              />
            ))}
          </Card>
        </section>

        {/* Note */}
        <section aria-label="Note for the cleaner">
          <TextArea
            label="Note for the cleaner"
            value={draft.note}
            onChange={(v) => setDraft({ note: v })}
            placeholder="Where the key is, what to check, anything unusual"
            hint="Only the cleaner and inspector see this."
          />
        </section>
      </div>

      {/* Sticky price footer */}
      <div className="sticky bottom-0 z-sticky mt-auto border-t border-line bg-surface px-4 pb-8 pt-3 shadow-footer">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPriceOpen(true)}
            aria-label={`Total ${money(q.total)}. Show price breakdown`}
            className="press -ml-2 flex flex-1 flex-col items-start rounded-control px-2 py-1 text-left hover:bg-canvas"
          >
            <span className="flex items-center gap-1 text-caption font-medium text-muted">
              Total <ChevronUp aria-hidden className="size-3.5" />
            </span>
            <span className="tnum text-title font-bold text-ink">{money(q.total)}</span>
            {q.adjustments.length > 0 && <span className="text-caption text-risk-ink">Holiday pricing applies</span>}
          </button>
          <Button onClick={next} trailing={<ArrowRight aria-hidden className="size-5" />}>
            Review booking
          </Button>
        </div>
      </div>

      <PriceSheet
        open={priceOpen}
        onClose={() => setPriceOpen(false)}
        quote={q}
        cheaper={cheaper}
        onTakeCheaper={() => {
          setDraft({ day: 3, checkout: 9 * 60, checkin: draft.checkin && draft.checkin > 9 * 60 ? draft.checkin : 15 * 60 });
          setPriceOpen(false);
        }}
      />

      <Sheet open={propOpen} onClose={() => setPropOpen(false)} title="Choose property">
        <div role="radiogroup" aria-label="Property" className="flex flex-col gap-2">
          {PROPERTIES.map((pp) => (
            <button
              key={pp.id}
              type="button"
              role="radio"
              aria-checked={pp.id === p.id}
              onClick={() => {
                setDraft({ propertyId: pp.id });
                setPropOpen(false);
              }}
              className={cx('press flex items-center gap-3 rounded-card border p-2 text-left', pp.id === p.id ? 'border-navy bg-navy-soft/50' : 'border-line')}
            >
              <img src={pp.photo} alt="" className="size-14 rounded-control object-cover" />
              <span className="flex-1">
                <span className="block text-body font-bold">{propertyTitle(pp)}</span>
                <span className="block text-caption text-muted">{sizeLabel(pp)}</span>
              </span>
              {pp.id === p.id && <Check aria-hidden className="mr-2 size-5 text-navy" strokeWidth={3} />}
            </button>
          ))}
        </div>
      </Sheet>
    </div>
  );
};
