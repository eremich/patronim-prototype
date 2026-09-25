import { useNavigate } from 'react-router-dom';
import { CheckCircle2, MapPin, RotateCcw, Star } from 'lucide-react';
import { Avatar } from '../../components/Avatar';
import { Card } from '../../components/Card';
import { ListItem } from '../../components/ListItem';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionTitle } from '../../components/SectionTitle';
import { StatusBadge } from '../../components/StatusBadge';
import { PROPERTIES, propertyTitle } from '../../data/catalog';
import { RoleAvatar } from '../../app/Shell';
import { stageView } from '../../lib/status';
import { clock } from '../../lib/time';
import { cx } from '../../lib/cx';
import { useStore } from '../../store/useStore';

/** Pin positions on the static map, in % of the image */
const PINS: Record<string, [number, number]> = {
  'ben-yehuda': [38, 30],
  hayarkon: [30, 18],
  bograshov: [48, 44],
  levinski: [62, 82],
  weizmann: [78, 22],
};

export const MapScreen = () => {
  const navigate = useNavigate();
  const jobs = useStore((s) => s.jobs);
  const today = jobs.filter((j) => j.checkin < 1440);
  return (
    <div className="screen-enter flex flex-1 flex-col">
      <ScreenHeader large title="Map" subtitle="Today's properties" trailing={<RoleAvatar role="inspector" />} />
      <div className="relative mx-4 overflow-hidden rounded-card border border-line">
        <img src="/mock/map-tel-aviv.svg" alt="Map of central Tel Aviv with today's properties" className="block w-full" />
        {today.map((j) => {
          const [x, y] = PINS[j.propertyId];
          const insp = j.status === 'inspection';
          return (
            <button
              key={j.id}
              type="button"
              aria-label={`${propertyTitle(PROPERTIES.find((p) => p.id === j.propertyId)!)}, ${stageView(j).label}`}
              onClick={() => insp && navigate(`/i/inspect/${j.id}`)}
              className="absolute -translate-x-1/2 -translate-y-full"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <span className={cx('flex items-center gap-1 rounded-chip px-2 py-1 text-caption font-bold shadow-toast', insp ? 'bg-navy text-surface' : 'bg-surface text-ink')}>
                <MapPin aria-hidden className="size-3.5" />
                {clock(j.checkin)}
              </span>
            </button>
          );
        })}
      </div>
      <p className="px-4 pt-3 text-caption text-muted">Navy pins are ready to inspect. Times are guest check-in.</p>
    </div>
  );
};

export const History = () => {
  const jobs = useStore((s) => s.jobs);
  const done = jobs.filter((j) => j.status === 'ready' || j.status === 'rework');
  return (
    <div className="screen-enter flex flex-col gap-4 px-4 pb-6">
      <ScreenHeader large title="History" subtitle="This week" trailing={<RoleAvatar role="inspector" />} />
      <Card padded={false} className="-mt-4 px-4">
        {done.map((j) => (
          <ListItem
            key={j.id}
            divider
            title={propertyTitle(PROPERTIES.find((p) => p.id === j.propertyId)!)}
            subtitle="Today"
            trailing={j.status === 'ready' ? <StatusBadge tone="ok" label="Passed" size="sm" /> : <StatusBadge tone="late" icon={RotateCcw} label="Sent back" size="sm" />}
          />
        ))}
        <ListItem divider title="77 Ben Yehuda St, Apt 4" subtitle="Tue 29 Sep" trailing={<StatusBadge tone="ok" label="Passed" size="sm" />} />
        <ListItem title="164 Hayarkon St, Apt 12" subtitle="Mon 28 Sep" trailing={<StatusBadge tone="ok" label="Passed" size="sm" />} />
      </Card>
    </div>
  );
};

export const InspectorProfile = () => (
  <div className="screen-enter flex flex-col gap-6 px-4 pb-6">
    <ScreenHeader large title="Profile" trailing={<RoleAvatar role="inspector" />} />
    <Card className="-mt-4 flex items-center gap-3">
      <Avatar size="lg" initials="NS" name="Noa Shapiro" />
      <div>
        <p className="text-headline font-bold">Noa Shapiro</p>
        <p className="flex items-center gap-1 text-caption text-muted">
          <Star aria-hidden className="size-3.5 fill-navy text-navy" /> Quality controller · central Tel Aviv
        </p>
      </div>
    </Card>
    <section>
      <SectionTitle>This month</SectionTitle>
      <Card>
        <dl className="tnum grid grid-cols-[1fr_auto] gap-y-3 text-body">
          <dt className="text-muted">Inspections</dt>
          <dd className="font-bold">128</dd>
          <dt className="text-muted">Passed first time</dt>
          <dd className="flex items-center gap-1 font-bold">
            <CheckCircle2 aria-hidden className="size-4 text-ok" />
            91%
          </dd>
          <dt className="text-muted">Average inspection</dt>
          <dd className="font-bold">22 min</dd>
        </dl>
      </Card>
    </section>
  </div>
);
