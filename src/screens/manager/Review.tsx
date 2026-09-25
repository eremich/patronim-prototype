import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, FileText, Info, Wallet } from 'lucide-react';
import { Banner } from '../../components/Banner';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionTitle } from '../../components/SectionTitle';
import { EXTRA_LABELS, propertyTitle } from '../../data/catalog';
import { emptyDraft, type Draft } from '../../data/scenarios';
import type { Extras } from '../../data/types';
import { money } from '../../lib/pricing';
import { clock, dayLabel, duration } from '../../lib/time';
import { cx } from '../../lib/cx';
import { useStore } from '../../store/useStore';
import { PriceSheet } from './PriceSheet';
import { useBooking } from './Book';

const METHODS: { id: Draft['payment']; label: string; detail: string; icon: typeof CreditCard }[] = [
  { id: 'card', label: 'Visa •••• 4242', detail: 'Saved card', icon: CreditCard },
  { id: 'paypal', label: 'PayPal', detail: 'dana.levi@mail.com', icon: Wallet },
  { id: 'invoice', label: 'Invoice', detail: 'Pay within 14 days', icon: FileText },
];

const PAY_MS = 900;

export const Review = () => {
  const navigate = useNavigate();
  const { draft, p, svc, start, dur, checkin, q, cheaper } = useBooking();
  const setDraft = useStore((s) => s.setDraft);
  const createBooking = useStore((s) => s.createBooking);
  const paymentFails = useStore((s) => s.paymentFails);
  const [paying, setPaying] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);

  const extras = (Object.keys(draft.extras) as (keyof Extras)[]).filter((k) => draft.extras[k] > 0);

  const pay = () => {
    setPaying(true);
    setDeclined(false);
    setTimeout(() => {
      setPaying(false);
      if (paymentFails && draft.payment === 'card') {
        setDeclined(true);
        return;
      }
      const id = createBooking();
      setDraft(emptyDraft());
      navigate(`/m/confirmed/${id}`, { replace: true });
    }, PAY_MS);
  };

  return (
    <div className="screen-enter flex flex-1 flex-col">
      <ScreenHeader title="Review and pay" onBack={() => navigate('/m/book')} backLabel="Edit" />
      <div className="flex flex-col gap-6 px-4 pb-8 pt-2">
        {declined && (
          <Banner tone="late" title="Your card was declined.">
            Try another card or pay by invoice.
          </Banner>
        )}

        <Card padded={false}>
          <div className="flex items-center gap-3 border-b border-line p-4">
            <img src={p.photo} alt="" className="size-14 rounded-control object-cover" />
            <div className="min-w-0">
              <p className="truncate text-headline font-bold">{propertyTitle(p)}</p>
              <p className="text-caption text-muted">{svc.name}</p>
            </div>
          </div>
          <dl className="tnum grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 p-4 text-body">
            <dt className="text-muted">Date</dt>
            <dd className="text-right font-medium">{dayLabel(draft.day)}</dd>
            <dt className="text-muted">Guest checkout</dt>
            <dd className="text-right font-medium">{clock(draft.checkout)}</dd>
            <dt className="text-muted">Guest check-in</dt>
            <dd className="text-right font-bold">{checkin !== null ? clock(checkin) : '—'}</dd>
            <dt className="text-muted">Cleaning</dt>
            <dd className="text-right font-medium">
              {clock(start)}–{clock(start + dur)}
            </dd>
            {extras.length > 0 && (
              <>
                <dt className="text-muted">Extras</dt>
                <dd className="text-right font-medium">{extras.map((k) => `${EXTRA_LABELS[k].name} × ${draft.extras[k]}`).join(', ')}</dd>
              </>
            )}
            {draft.note && (
              <>
                <dt className="text-muted">Note</dt>
                <dd className="text-right font-medium">{draft.note}</dd>
              </>
            )}
          </dl>
          <button type="button" onClick={() => setPriceOpen(true)} className="press flex w-full items-center justify-between border-t border-line p-4 text-left">
            <span>
              <span className="block text-headline font-bold">Total</span>
              <span className="block text-caption font-bold text-navy">See how it adds up</span>
            </span>
            <span className="tnum text-title font-bold">{money(q.total)}</span>
          </button>
        </Card>

        <section aria-labelledby="pay-h">
          <SectionTitle id="pay-h">Payment method</SectionTitle>
          <div role="radiogroup" aria-labelledby="pay-h" className="flex flex-col gap-2">
            {METHODS.map(({ id, label, detail, icon: Icon }) => {
              const on = draft.payment === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => {
                    setDraft({ payment: id });
                    setDeclined(false);
                  }}
                  className={cx(
                    'press flex min-h-14 items-center gap-3 rounded-card border px-4 text-left transition-colors duration-150',
                    on ? 'border-navy bg-navy-soft/50 ring-1 ring-navy' : 'border-line bg-surface hover:border-navy/40',
                  )}
                >
                  <Icon aria-hidden className={cx('size-5', on ? 'text-navy' : 'text-muted')} />
                  <span className="flex-1">
                    <span className="block text-body font-bold">{label}</span>
                    <span className="block text-caption text-muted">{detail}</span>
                  </span>
                  <span aria-hidden className={cx('flex size-5 items-center justify-center rounded-chip border-2', on ? 'border-navy bg-navy' : 'border-line')}>
                    {on && <span className="size-2 rounded-chip bg-surface" />}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <p className="flex gap-2 text-caption text-muted">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
          Free cancellation until 24 h before start. After that, 50% refund.
        </p>
        <p className="tnum -mt-4 pl-6 text-caption text-muted">About {duration(dur)} of work. A cleaner is assigned as soon as you pay.</p>
      </div>

      <div className="sticky bottom-0 z-sticky mt-auto border-t border-line bg-surface px-4 pb-8 pt-3 shadow-footer">
        <Button block loading={paying} onClick={pay}>
          {paying ? 'Paying…' : draft.payment === 'invoice' ? `Book and invoice ${money(q.total)}` : `Pay ${money(q.total)}`}
        </Button>
      </div>

      <PriceSheet open={priceOpen} onClose={() => setPriceOpen(false)} quote={q} cheaper={cheaper} />
    </div>
  );
};
