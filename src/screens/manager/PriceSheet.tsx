import { TrendingDown } from 'lucide-react';
import { Banner } from '../../components/Banner';
import { Button } from '../../components/Button';
import { Sheet } from '../../components/Sheet';
import type { Quote } from '../../lib/pricing';
import { money } from '../../lib/pricing';

interface Props {
  open: boolean;
  onClose: () => void;
  quote: Quote;
  cheaper: { label: string; save: number } | null;
  onTakeCheaper?: () => void;
}

const Row = ({ label, detail, amount, strong }: { label: string; detail?: string; amount: string; strong?: boolean }) => (
  <div className="flex items-start justify-between gap-4 py-2.5">
    <div>
      <p className={strong ? 'text-body font-bold text-ink' : 'text-body text-ink'}>{label}</p>
      {detail && <p className="text-caption text-muted">{detail}</p>}
    </div>
    <p className={`tnum shrink-0 text-body ${strong ? 'font-bold' : 'font-medium'} text-ink`}>{amount}</p>
  </div>
);

/** Price breakdown: base, extras, and every dynamic adjustment explained in plain words */
export const PriceSheet = ({ open, onClose, quote, cheaper, onTakeCheaper }: Props) => (
  <Sheet
    open={open}
    onClose={onClose}
    title="How the price adds up"
    footer={
      <div className="flex items-baseline justify-between">
        <span className="text-headline font-bold">Total</span>
        <span className="tnum text-title font-bold">{money(quote.total)}</span>
      </div>
    }
  >
    <div className="divide-y divide-line">
      <Row label={quote.base.label} detail={quote.base.detail} amount={money(quote.base.amount)} />
      {quote.extras.map((l) => (
        <Row key={l.label} label={l.label} amount={money(l.amount)} />
      ))}
    </div>
    {quote.adjustments.length > 0 && (
      <div className="mt-4">
        <h3 className="mb-1 text-body font-bold text-ink">Why the price is higher today</h3>
        <div className="divide-y divide-line">
          {quote.adjustments.map((l) => (
            <Row key={l.label} label={l.label} detail={l.detail} amount={`+${money(l.amount)}`} />
          ))}
        </div>
      </div>
    )}
    {cheaper && (
      <div className="mt-4">
        <Banner
          tone="info"
          title={`Book for ${cheaper.label} to save ${money(cheaper.save)}`}
          action={
            onTakeCheaper && (
              <Button size="md" variant="secondary" icon={<TrendingDown aria-hidden className="size-4" />} onClick={onTakeCheaper}>
                Switch to {cheaper.label.split(' ')[0]}
              </Button>
            )
          }
        >
          No holiday or short-notice charges then. Only works if your guests arrive later.
        </Banner>
      </div>
    )}
  </Sheet>
);
