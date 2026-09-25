import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Check, KeyRound, MapPin, Package, Play, RotateCcw, Send } from 'lucide-react';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionTitle } from '../../components/SectionTitle';
import { StatusBadge } from '../../components/StatusBadge';
import { TurnoverWindowBar } from '../../components/TurnoverWindowBar';
import { EXTRA_LABELS, PEOPLE, sizeLabel } from '../../data/catalog';
import type { Extras } from '../../data/types';
import { jobProperty, jobService, useJob, windowProps } from '../../app/hooks';
import { NOW, dayOf, duration, when } from '../../lib/time';
import { cx } from '../../lib/cx';
import { redoItems, useStore } from '../../store/useStore';

export const JobDetail = () => {
  const { id } = useParams();
  const job = useJob(id);
  const navigate = useNavigate();
  const startJob = useStore((s) => s.startJob);
  const markFixed = useStore((s) => s.markFixed);
  const submit = useStore((s) => s.submitForInspection);
  const toast = useStore((s) => s.toast);
  useStore((s) => s.now);
  if (!job) return <Navigate to="/p" replace />;

  const p = jobProperty(job);
  const redo = redoItems(job);
  const allFixed = redo.length > 0 && redo.every((r) => r.fixed);
  const extras = (Object.keys(job.extras) as (keyof Extras)[]).filter((k) => job.extras[k] > 0);
  const future = dayOf(job.start) > 0;

  const footer = (() => {
    if (job.status === 'rework')
      return (
        <Button
          block
          disabled={!allFixed}
          icon={<Send aria-hidden className="size-5" />}
          onClick={() => {
            submit(job.id);
            toast('Sent for inspection');
            navigate('/p');
          }}
        >
          Send for inspection again
        </Button>
      );
    if (job.status === 'scheduled')
      return (
        <Button
          block
          disabled={future}
          icon={<Play aria-hidden className="size-5" />}
          onClick={() => {
            startJob(job.id);
            navigate(`/p/jobs/${job.id}/clean`);
          }}
        >
          {future ? `Starts ${when(job.start)}` : 'Start cleaning'}
        </Button>
      );
    if (job.status === 'cleaning')
      return (
        <Button block onClick={() => navigate(`/p/jobs/${job.id}/clean`)}>
          Continue cleaning
        </Button>
      );
    return null;
  })();

  return (
    <div className="screen-enter flex flex-1 flex-col">
      <ScreenHeader title="Job" onBack={() => navigate('/p')} backLabel="Jobs" />
      <div className="flex flex-col gap-6 px-4 pb-8 pt-2">
        {job.status === 'rework' && (
          <Card tone="late" className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <StatusBadge tone="late" icon={RotateCcw} label={`${redo.filter((r) => !r.fixed).length || redo.length} item to redo`} />
              <span className="tnum text-caption font-bold text-ink">Guest arrives in {duration(job.checkin - NOW)}</span>
            </div>
            {redo.map((r) => (
              <div key={r.id} className="flex flex-col gap-3">
                <div>
                  <p className="text-caption text-muted">{r.roomName}</p>
                  <p className="text-headline font-bold">{r.label}</p>
                </div>
                {r.redoNote && (
                  <div className="flex gap-2">
                    <Avatar size="sm" initials={PEOPLE[job.inspectorId].initials} name={PEOPLE[job.inspectorId].name} />
                    <p className="rounded-control rounded-tl-none bg-canvas px-3 py-2 text-body text-ink">{r.redoNote}</p>
                  </div>
                )}
                {r.redoPhoto && <img src={r.redoPhoto} alt={`Inspector photo: ${r.label}`} className="aspect-[4/3] w-full rounded-card border border-line object-cover" />}
                <button
                  type="button"
                  aria-pressed={!!r.fixed}
                  onClick={() => markFixed(job.id, r.id)}
                  className={cx(
                    'press flex min-h-12 items-center justify-center gap-2 rounded-control border text-body font-bold transition-colors duration-150',
                    r.fixed ? 'border-ok bg-ok/10 text-ok-ink' : 'border-line bg-surface text-navy hover:bg-navy-soft',
                  )}
                >
                  <Check aria-hidden className="size-5" strokeWidth={3} />
                  {r.fixed ? 'Fixed' : 'Mark as fixed'}
                </button>
              </div>
            ))}
          </Card>
        )}

        <div>
          <h1 className="text-title font-bold">
            {p.street}, {p.unit}
          </h1>
          <p className="tnum text-body text-muted">
            {jobService(job).name} · {sizeLabel(p)} · zip {p.zip}
          </p>
        </div>

        <Card>
          <TurnoverWindowBar {...windowProps(job)} />
        </Card>

        <Card padded={false} className="divide-y divide-line">
          <div className="flex gap-3 p-4">
            <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-muted" />
            <div className="flex-1">
              <p className="text-body font-bold">
                {p.street}, {p.unit}, Tel Aviv
              </p>
              <button type="button" onClick={() => toast('Opening maps')} className="mt-1 text-body font-bold text-navy">
                Get directions
              </button>
            </div>
          </div>
          <div className="flex gap-3 p-4">
            <KeyRound aria-hidden className="mt-0.5 size-5 shrink-0 text-muted" />
            <div>
              <p className="text-caption text-muted">Access</p>
              <p className="text-body">{p.access}</p>
            </div>
          </div>
        </Card>

        {job.note && (
          <section aria-labelledby="note-h">
            <SectionTitle id="note-h">Note from the manager</SectionTitle>
            <div className="flex gap-2">
              <Avatar size="sm" initials="DL" name="Dana Levi" />
              <p className="rounded-control rounded-tl-none border border-line bg-surface px-3 py-2 text-body">{job.note}</p>
            </div>
          </section>
        )}

        <section aria-labelledby="bring-h">
          <SectionTitle id="bring-h">Bring with you</SectionTitle>
          <Card className="flex flex-col gap-2">
            {extras.length === 0 && <p className="text-body text-muted">Nothing extra. Standard kit only.</p>}
            {extras.map((k) => (
              <p key={k} className="tnum flex items-center gap-2 text-body">
                <Package aria-hidden className="size-4 text-muted" />
                <span className="flex-1">{EXTRA_LABELS[k].name}</span>
                <span className="font-bold">× {job.extras[k]}</span>
              </p>
            ))}
          </Card>
        </section>
      </div>
      {footer && <div className="sticky bottom-0 z-sticky mt-auto border-t border-line bg-surface px-4 pb-8 pt-3 shadow-footer">{footer}</div>}
    </div>
  );
};
