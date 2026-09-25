import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Check, CheckCircle2, PackageX, Send } from 'lucide-react';
import { Banner } from '../../components/Banner';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { PhotoTile } from '../../components/PhotoTile';
import { ScreenHeader } from '../../components/ScreenHeader';
import { ROOM_PHOTOS } from '../../data/catalog';
import { jobProperty, useJob } from '../../app/hooks';
import { roomDone, roomsProgress } from '../../lib/health';
import { cx } from '../../lib/cx';
import { useStore } from '../../store/useStore';
import { MissingItemSheet } from './MissingItemSheet';

export const Checklist = () => {
  const { id } = useParams();
  const job = useJob(id);
  const navigate = useNavigate();
  const toggle = useStore((s) => s.toggleItem);
  const addPhoto = useStore((s) => s.addPhoto);
  const submit = useStore((s) => s.submitForInspection);
  const toast = useStore((s) => s.toast);
  const offline = useStore((s) => s.offline);
  const [missingOpen, setMissingOpen] = useState(false);
  if (!job) return <Navigate to="/p" replace />;

  const p = jobProperty(job);
  const prog = roomsProgress(job);
  const photosLeft = job.rooms.filter((r) => !r.photo).length;

  return (
    <div className="screen-enter flex flex-1 flex-col">
      <ScreenHeader title={p.street} onBack={() => navigate(`/p/jobs/${job.id}`)} backLabel="Job" />

      <div className="sticky top-0 z-sticky border-b border-line bg-canvas px-4 pb-3 pt-1">
        <div className="flex items-baseline justify-between">
          <p className="tnum text-headline font-bold" aria-live="polite">
            {prog.done} of {prog.total} rooms done
          </p>
          {job.missing.length > 0 && <p className="text-caption text-muted">{job.missing.length} missing reported</p>}
        </div>
        <div className="mt-2 flex gap-1" aria-hidden>
          {job.rooms.map((r) => (
            <span key={r.id} className={cx('h-1.5 flex-1 rounded-chip', roomDone(r) ? 'bg-ok' : r.items.some((i) => i.done) ? 'bg-navy/40' : 'bg-line')} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 pb-8 pt-4">
        {offline && (
          <Banner tone="offline" title="You're offline">
            Photos are saved on the phone and upload when you're back online.
          </Banner>
        )}
        {job.rooms.map((r) => {
          const done = r.items.filter((i) => i.done).length;
          const complete = roomDone(r);
          return (
            <Card key={r.id} as="section" aria-labelledby={`room-${r.id}`} padded={false}>
              <div className="flex items-center justify-between px-4 pb-2 pt-4">
                <h2 id={`room-${r.id}`} className="text-headline font-bold">
                  {r.name}
                </h2>
                {complete ? (
                  <span className="flex items-center gap-1 text-caption font-bold text-ok-ink">
                    <CheckCircle2 aria-hidden className="size-4" /> Done
                  </span>
                ) : (
                  <span className="tnum text-caption text-muted">
                    {done} of {r.items.length}
                  </span>
                )}
              </div>
              <ul>
                {r.items.map((it) => (
                  <li key={it.id}>
                    <label className="flex min-h-12 cursor-pointer items-center gap-3 px-4 py-1.5 hover:bg-canvas">
                      <input type="checkbox" className="peer sr-only" checked={it.done} onChange={() => toggle(job.id, r.id, it.id)} />
                      <span
                        aria-hidden
                        className={cx(
                          'flex size-6 shrink-0 items-center justify-center rounded-bar border-2 transition-colors duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-navy peer-focus-visible:ring-offset-2',
                          it.done ? 'border-ok bg-ok text-surface' : 'border-line bg-surface',
                        )}
                      >
                        {it.done && <Check className="size-4" strokeWidth={3} />}
                      </span>
                      <span className={cx('text-body', it.done ? 'text-muted line-through decoration-muted/60' : 'text-ink')}>{it.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
              <div className="p-4 pt-2">
                <PhotoTile
                  src={r.photo}
                  alt={r.photo ? `${r.name} after cleaning` : 'Add after photo'}
                  caption={r.photo ? 'After photo' : undefined}
                  required
                  onAdd={() => addPhoto(job.id, r.id, ROOM_PHOTOS[r.id])}
                  size={r.photo ? 'wide' : 'md'}
                />
              </div>
            </Card>
          );
        })}
        <Button variant="secondary" block icon={<PackageX aria-hidden className="size-5" />} onClick={() => setMissingOpen(true)}>
          Report missing item
        </Button>
      </div>

      <div className="sticky bottom-0 z-sticky mt-auto border-t border-line bg-surface px-4 pb-8 pt-3 shadow-footer">
        {photosLeft > 0 && (
          <p className="tnum mb-2 text-center text-caption text-muted">
            Add an after photo in {photosLeft === 1 ? '1 more room' : `${photosLeft} more rooms`} to submit
          </p>
        )}
        <Button
          block
          disabled={photosLeft > 0}
          icon={<Send aria-hidden className="size-5" />}
          onClick={() => {
            submit(job.id);
            toast('Sent for inspection');
            navigate('/p');
          }}
        >
          Submit for inspection
        </Button>
      </div>

      <MissingItemSheet open={missingOpen} onClose={() => setMissingOpen(false)} jobId={job.id} />
    </div>
  );
};
