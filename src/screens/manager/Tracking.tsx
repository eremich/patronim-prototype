import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Circle, CircleDashed, MessageCircle, PackageX, RotateCcw, Star } from 'lucide-react';
import { Avatar } from '../../components/Avatar';
import { Banner } from '../../components/Banner';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionTitle } from '../../components/SectionTitle';
import { Sheet } from '../../components/Sheet';
import { StatusBadge } from '../../components/StatusBadge';
import { TurnoverWindowBar } from '../../components/TurnoverWindowBar';
import { PEOPLE } from '../../data/catalog';
import { finishOf, jobProperty, jobService, useJob, windowProps } from '../../app/hooks';
import { health, roomDone } from '../../lib/health';
import { statusView } from '../../lib/status';
import { clock, duration } from '../../lib/time';
import { redoItems, useStore } from '../../store/useStore';

const QUICK = ['Thanks! How is it going?', 'Please send a photo of the balcony', 'Guest may arrive 30 min early'];

export const Tracking = () => {
  const { id } = useParams();
  const job = useJob(id);
  const navigate = useNavigate();
  const toast = useStore((s) => s.toast);
  useStore((s) => s.now);
  const [chat, setChat] = useState(false);
  if (!job) return <Navigate to="/m" replace />;

  const p = jobProperty(job);
  const s = statusView(job);
  const h = health(job);
  const finish = finishOf(job);
  const redo = redoItems(job);
  const cleaner = PEOPLE[job.patronId];

  return (
    <div className="screen-enter flex flex-1 flex-col">
      <ScreenHeader title={p.street} onBack={() => navigate('/m')} backLabel="Today" />
      <div className="flex flex-col gap-6 px-4 pb-8 pt-2">
        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-caption text-muted">
              {jobService(job).name} · {p.unit}
            </p>
            <StatusBadge label={s.label} tone={s.tone} icon={s.icon} />
          </div>
          <Card className="mt-3">
            <TurnoverWindowBar {...windowProps(job)} variant="full" />
            {job.status !== 'ready' && (
              <p className="tnum mt-3 border-t border-line pt-3 text-body text-ink">
                {job.status === 'scheduled' && <>Cleaning starts at {clock(job.start)}</>}
                {job.status === 'cleaning' && (
                  <>
                    Projected finish <strong>{clock(finish)}</strong>, then 30 min inspection
                  </>
                )}
                {job.status === 'inspection' && <>Cleaned by {clock(finish)}. {PEOPLE[job.inspectorId].name} is inspecting now.</>}
                {job.status === 'rework' && <>{cleaner.name.split(' ')[0]} is fixing what the inspector sent back.</>}
              </p>
            )}
          </Card>
        </div>

        {h !== 'ok' && job.status !== 'ready' && (
          <Banner tone={h === 'late' ? 'late' : 'risk'} title={finish > job.checkin ? `Running ${duration(finish - job.checkin)} behind check-in` : 'Tight for inspection'}>
            We've asked a second cleaner to help. You'll get an update in 15 min.
          </Banner>
        )}

        {job.status === 'ready' && (
          <Card tone="brand" className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 aria-hidden className="size-7 text-ok" />
              <div>
                <p className="text-headline font-bold">Ready for guest</p>
                <p className="tnum text-caption text-muted">Passed inspection · {duration(job.checkin - finish)} before check-in</p>
              </div>
            </div>
            {job.rating ? (
              <p className="flex items-center gap-1 text-body font-medium">
                <Star aria-hidden className="size-4 fill-navy text-navy" /> You rated it {job.rating} of 5
              </p>
            ) : (
              <Button block onClick={() => navigate(`/m/jobs/${job.id}/rate`)}>
                Rate the cleaning
              </Button>
            )}
          </Card>
        )}

        <section aria-labelledby="cleaner-h">
          <SectionTitle id="cleaner-h">Cleaner</SectionTitle>
          <Card className="flex items-center gap-3">
            <Avatar initials={cleaner.initials} name={cleaner.name} />
            <div className="flex-1">
              <p className="text-body font-bold">{cleaner.name}</p>
              <p className="text-caption text-muted">Rated 4.9 · 312 cleanings</p>
            </div>
            <Button size="md" variant="secondary" icon={<MessageCircle aria-hidden className="size-4" />} onClick={() => setChat(true)}>
              Message
            </Button>
          </Card>
        </section>

        {job.rooms.length > 0 && (
          <section aria-labelledby="rooms-h">
            <SectionTitle id="rooms-h" trailing={<span className="tnum text-caption text-muted">{job.rooms.filter(roomDone).length} of {job.rooms.length} done</span>}>
              Rooms
            </SectionTitle>
            <Card padded={false} className="divide-y divide-line">
              {job.rooms.map((r) => {
                const done = r.items.filter((i) => i.done).length;
                const complete = roomDone(r);
                const sent = redo.filter((x) => x.roomId === r.id);
                const Icon = sent.length ? RotateCcw : complete ? CheckCircle2 : done > 0 ? CircleDashed : Circle;
                return (
                  <div key={r.id} className="flex items-center gap-3 p-3">
                    {r.photo ? (
                      <img src={r.photo} alt={`${r.name} after cleaning`} className="size-14 shrink-0 rounded-control object-cover" />
                    ) : (
                      <span className="flex size-14 shrink-0 items-center justify-center rounded-control bg-canvas text-caption text-muted">No photo</span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-body font-bold">{r.name}</p>
                      <p className={`tnum text-caption ${sent.length ? 'font-bold text-risk-ink' : 'text-muted'}`}>
                        {sent.length ? `Redo: ${sent[0].label.toLowerCase()}` : complete ? 'Done, after photo added' : `${done} of ${r.items.length} tasks`}
                      </p>
                    </div>
                    <Icon aria-hidden className={`size-5 ${sent.length ? 'text-risk' : complete ? 'text-ok' : 'text-muted'}`} />
                  </div>
                );
              })}
            </Card>
          </section>
        )}

        {job.missing.length > 0 && (
          <section aria-labelledby="missing-h">
            <SectionTitle id="missing-h">Reported missing</SectionTitle>
            <Card className="flex flex-col gap-2">
              {job.missing.map((m) => (
                <p key={m.id} className="tnum flex items-center gap-2 text-body">
                  <PackageX aria-hidden className="size-4 text-risk" />
                  <span className="flex-1">
                    {m.type} × {m.quantity}
                  </span>
                  <span className="text-caption text-muted">{clock(m.at)}</span>
                </p>
              ))}
              <p className="text-caption text-muted">Added to the next linen delivery. No action needed.</p>
            </Card>
          </section>
        )}
      </div>

      <Sheet open={chat} onClose={() => setChat(false)} title={`Message ${cleaner.name.split(' ')[0]}`} description="Quick replies. Full chat is in Messages.">
        <div className="flex flex-col items-start gap-2">
          {QUICK.map((q) => (
            <Chip
              key={q}
              label={q}
              onClick={() => {
                setChat(false);
                toast('Message sent');
              }}
            />
          ))}
        </div>
      </Sheet>
    </div>
  );
};
