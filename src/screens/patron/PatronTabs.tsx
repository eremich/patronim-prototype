import { CloudOff, Star } from 'lucide-react';
import { Avatar } from '../../components/Avatar';
import { Card } from '../../components/Card';
import { ListItem } from '../../components/ListItem';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionTitle } from '../../components/SectionTitle';
import { RoleAvatar } from '../../app/Shell';
import { money } from '../../lib/pricing';
import { useStore } from '../../store/useStore';
import { AppearanceCard } from '../../app/AppearanceCard';

const THREADS = [
  { who: 'Dana Levi', initials: 'DL', text: 'Guest may arrive 30 min early at Hayarkon', at: '11:32', unread: true },
  { who: 'Noa Shapiro', initials: 'NS', text: 'Weizmann looked great, thanks', at: '11:05', unread: false },
  { who: 'Patronim dispatch', initials: 'PD', text: 'Linen for Bograshov is in the hallway cupboard', at: '09:10', unread: false },
];

export const Messages = () => (
  <div className="screen-enter flex flex-col">
    <ScreenHeader large title="Messages" trailing={<RoleAvatar role="patron" />} />
    <div className="px-4 pb-6">
    <Card padded={false} className="-mt-2 px-4">
      {THREADS.map((t) => (
        <ListItem
          key={t.who}
          divider
          leading={<Avatar initials={t.initials} name={t.who} />}
          title={t.who}
          subtitle={<span className={t.unread ? 'font-bold text-ink' : undefined}>{t.text}</span>}
          trailing={<span className="tnum text-caption text-muted">{t.at}</span>}
        />
      ))}
    </Card>
      </div>
  </div>
);

const RECENT = [
  { place: '3 Weizmann St, Apt 1', when: 'Today', amount: 170 },
  { place: '164 Hayarkon St, Apt 12', when: 'Yesterday', amount: 150 },
  { place: '77 Ben Yehuda St, Apt 4', when: 'Tue 29 Sep', amount: 185 },
  { place: '3 Bograshov St, Apt 1', when: 'Mon 28 Sep', amount: 230 },
];

export const Earnings = () => (
  <div className="screen-enter flex flex-col">
    <ScreenHeader large title="Earnings" subtitle="October so far" trailing={<RoleAvatar role="patron" />} />
    <div className="flex flex-col gap-6 px-4 pb-6">
    <div className="-mt-4">
      <p className="text-caption text-muted">This month</p>
      <p className="tnum text-display font-bold">{money(6840)}</p>
      <p className="text-caption text-muted">Paid every Sunday to your bank account</p>
    </div>
    <Card padded={false} className="divide-y divide-line">
      <dl className="tnum grid grid-cols-[1fr_auto] gap-y-3 p-4 text-body">
        <dt className="text-muted">Hours worked</dt>
        <dd className="font-bold">92 h</dd>
        <dt className="text-muted">Apartments cleaned</dt>
        <dd className="font-bold">41</dd>
        <dt className="text-muted">Average per apartment</dt>
        <dd className="font-bold">2 h 15 min</dd>
        <dt className="text-muted">Passed first inspection</dt>
        <dd className="font-bold">38 of 41</dd>
      </dl>
    </Card>
    <section>
      <SectionTitle>Recent</SectionTitle>
      <Card padded={false} className="px-4">
        {RECENT.map((r) => (
          <ListItem key={r.place + r.when} divider title={r.place} subtitle={r.when} trailing={<span className="tnum font-bold">{money(r.amount)}</span>} />
        ))}
      </Card>
    </section>
      </div>
  </div>
);

export const PatronProfile = () => {
  const offline = useStore((s) => s.offline);
  const setOffline = useStore((s) => s.setOffline);
  return (
    <div className="screen-enter flex flex-col">
      <ScreenHeader large title="Profile" trailing={<RoleAvatar role="patron" />} />
      <div className="flex flex-col gap-6 px-4 pb-6">
      <Card className="-mt-4 flex items-center gap-3">
        <Avatar size="lg" initials="AM" name="Avi Mizrahi" />
        <div>
          <p className="text-headline font-bold">Avi Mizrahi</p>
          <p className="flex items-center gap-1 text-caption text-muted">
            <Star aria-hidden className="size-3.5 fill-navy text-navy" /> 4.9 · 312 cleanings
          </p>
        </div>
      </Card>
      <Card padded={false} className="px-4">
        <label className="flex min-h-14 cursor-pointer items-center gap-3">
          <CloudOff aria-hidden className="size-5 text-muted" />
          <span className="flex-1">
            <span className="block text-body font-medium">Simulate offline</span>
            <span className="block text-caption text-muted">Prototype only: shows the offline banner</span>
          </span>
          <input type="checkbox" checked={offline} onChange={(e) => setOffline(e.target.checked)} className="size-5 accent-navy" />
        </label>
      </Card>
      <AppearanceCard />
          </div>
    </div>
  );
};
