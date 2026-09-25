import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Check, CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { PhotoTile } from '../../components/PhotoTile';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Sheet } from '../../components/Sheet';
import { TextArea } from '../../components/TextArea';
import { TurnoverWindowBar } from '../../components/TurnoverWindowBar';
import { PEOPLE, REDO_PHOTO } from '../../data/catalog';
import type { ChecklistItem } from '../../data/types';
import { jobProperty, jobService, useJob, windowProps } from '../../app/hooks';
import { NOW, clock, duration } from '../../lib/time';
import { cx } from '../../lib/cx';
import { useStore } from '../../store/useStore';

export const Inspection = () => {
  const { id } = useParams();
  const job = useJob(id);
  const navigate = useNavigate();
  const markItem = useStore((s) => s.markItem);
  const passRoom = useStore((s) => s.passRoom);
  const markReady = useStore((s) => s.markReady);
  const sendBack = useStore((s) => s.sendBack);
  const toast = useStore((s) => s.toast);
  const [roomId, setRoomId] = useState<string>();
  const [redoFor, setRedoFor] = useState<ChecklistItem | null>(null);
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<string | undefined>();
  if (!job) return <Navigate to="/i" replace />;

  const p = jobProperty(job);
  const items = job.rooms.flatMap((r) => r.items);
  const redoCount = items.filter((i) => i.mark === 'redo').length;
  const unchecked = items.filter((i) => !i.mark).length;
  // Start on the first room that still needs a look
  const current = job.rooms.find((r) => r.id === roomId) ?? job.rooms.find((r) => r.items.some((i) => !i.mark)) ?? job.rooms[0];
  const cleaner = PEOPLE[job.patronId].name;

  const openRedo = (it: ChecklistItem) => {
    setRedoFor(it);
    setNote(it.redoNote ?? '');
    setPhoto(it.redoPhoto);
  };

  return (
    <div className="screen-enter flex flex-1 flex-col">
      <ScreenHeader title={p.street} onBack={() => navigate('/i')} backLabel="Queue" />
      <div className="flex flex-col gap-4 px-4 pb-8 pt-2">
        <div>
          <p className="tnum text-caption text-muted">
            {jobService(job).name} · cleaned by {cleaner}
          </p>
          <p className="tnum text-headline font-bold">
            Guest arrives {clock(job.checkin)}, in {duration(job.checkin - NOW)}
          </p>
          <div className="mt-3">
            <TurnoverWindowBar {...windowProps(job)} variant="compact" />
          </div>
        </div>

        <div role="tablist" aria-label="Rooms" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {job.rooms.map((r) => {
            const on = r.id === current.id;
            const redo = r.items.some((i) => i.mark === 'redo');
            const done = r.items.every((i) => i.mark === 'pass');
            return (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setRoomId(r.id)}
                className={cx(
                  'press flex min-h-11 shrink-0 items-center gap-1.5 rounded-chip border px-4 text-body transition-colors duration-150',
                  on ? 'border-navy bg-navy text-surface' : 'border-line bg-surface text-ink hover:border-navy/40',
                  on ? 'font-bold' : 'font-medium',
                )}
              >
                {redo ? (
                  <RotateCcw aria-hidden className={cx('size-4', on ? 'text-surface' : 'text-late')} />
                ) : done ? (
                  <CheckCircle2 aria-hidden className={cx('size-4', on ? 'text-surface' : 'text-ok')} />
                ) : null}
                {r.name}
                <span className="sr-only">{redo ? ', needs redo' : done ? ', passed' : ''}</span>
              </button>
            );
          })}
        </div>

        <section aria-label={current.name} className="flex flex-col gap-3">
          {current.photo ? (
            <PhotoTile src={current.photo} alt={`${current.name} after cleaning, photo by ${cleaner}`} caption={`${cleaner.split(' ')[0]}'s photo`} size="wide" />
          ) : (
            <p className="rounded-card border border-line bg-surface p-4 text-body text-muted">No photo for this room.</p>
          )}
          <Card padded={false} className="divide-y divide-line">
            {current.items.map((it) => (
              <div key={it.id} className="flex items-center gap-2 py-2 pl-4 pr-2">
                <div className="min-w-0 flex-1">
                  <p className="text-body text-ink">{it.label}</p>
                  {it.fixed && it.mark !== 'redo' && <p className="text-caption font-bold text-navy">Fixed by {cleaner.split(' ')[0]}, check again</p>}
                  {it.mark === 'redo' && it.redoNote && <p className="truncate text-caption text-late-ink">{it.redoNote}</p>}
                </div>
                <div role="group" aria-label={it.label} className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    aria-pressed={it.mark === 'pass'}
                    aria-label={`Pass: ${it.label}`}
                    onClick={() => markItem(job.id, it.id, 'pass')}
                    className={cx(
                      'press flex h-11 items-center gap-1 rounded-control border px-3 text-caption font-bold transition-colors duration-150',
                      it.mark === 'pass' ? 'border-ok bg-ok text-surface' : 'border-line bg-surface text-ink hover:border-ok',
                    )}
                  >
                    <Check aria-hidden className="size-4" strokeWidth={3} /> Pass
                  </button>
                  <button
                    type="button"
                    aria-pressed={it.mark === 'redo'}
                    aria-label={`Needs redo: ${it.label}`}
                    onClick={() => openRedo(it)}
                    className={cx(
                      'press flex h-11 items-center gap-1 rounded-control border px-3 text-caption font-bold transition-colors duration-150',
                      it.mark === 'redo' ? 'border-late bg-late text-surface' : 'border-line bg-surface text-ink hover:border-late',
                    )}
                  >
                    <RotateCcw aria-hidden className="size-4" /> Redo
                  </button>
                </div>
              </div>
            ))}
          </Card>
          {current.items.some((i) => !i.mark) && (
            <Button variant="secondary" size="md" block icon={<Check aria-hidden className="size-4" strokeWidth={3} />} onClick={() => passRoom(job.id, current.id)}>
              Pass the rest of {current.name.toLowerCase()}
            </Button>
          )}
        </section>
      </div>

      <div className="sticky bottom-0 z-sticky mt-auto border-t border-line bg-surface px-4 pb-8 pt-3 shadow-footer">
        {redoCount > 0 ? (
          <Button
            block
            variant="danger"
            icon={<RotateCcw aria-hidden className="size-5" />}
            disabled={unchecked > 0}
            onClick={() => {
              sendBack(job.id);
              toast('Sent back to cleaner');
              navigate('/i');
            }}
          >
            {unchecked > 0 ? `Check ${unchecked} more to send back` : `Send back to cleaner`}
          </Button>
        ) : (
          <Button
            block
            disabled={unchecked > 0}
            icon={<CheckCircle2 aria-hidden className="size-5" />}
            onClick={() => {
              markReady(job.id);
              toast('Marked as ready');
              navigate('/i');
            }}
          >
            {unchecked > 0 ? `Check ${unchecked} more ${unchecked === 1 ? 'item' : 'items'}` : 'Mark as ready'}
          </Button>
        )}
      </div>

      <Sheet
        open={!!redoFor}
        onClose={() => setRedoFor(null)}
        title="Needs redo"
        description={redoFor ? `${current.name}: ${redoFor.label}` : undefined}
        footer={
          <Button
            block
            variant="danger"
            disabled={!note.trim()}
            onClick={() => {
              if (redoFor) markItem(job.id, redoFor.id, 'redo', note.trim(), photo);
              setRedoFor(null);
            }}
          >
            Mark as needs redo
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <TextArea label="What needs fixing" value={note} onChange={setNote} placeholder="Say what's wrong and how to fix it" hint={`${cleaner.split(' ')[0]} sees this note and your photo.`} />
          <div>
            <p className="mb-2 text-caption font-bold text-ink">Photo (optional)</p>
            <PhotoTile src={photo} alt={photo ? 'Photo of the problem' : 'Add photo'} onAdd={() => setPhoto(REDO_PHOTO)} size={photo ? 'wide' : 'md'} />
          </div>
        </div>
      </Sheet>
    </div>
  );
};
