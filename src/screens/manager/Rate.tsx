import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/Button';
import { ScreenHeader } from '../../components/ScreenHeader';
import { StarRating } from '../../components/StarRating';
import { StatusBadge } from '../../components/StatusBadge';
import { TextArea } from '../../components/TextArea';
import { PEOPLE } from '../../data/catalog';
import { finishOf, jobProperty, jobService, useJob } from '../../app/hooks';
import { clock, duration } from '../../lib/time';
import { useStore } from '../../store/useStore';

export const Rate = () => {
  const { id } = useParams();
  const job = useJob(id);
  const navigate = useNavigate();
  const rate = useStore((s) => s.rate);
  const toast = useStore((s) => s.toast);
  const [stars, setStars] = useState(job?.rating ?? 0);
  const [comment, setComment] = useState(job?.comment ?? '');
  if (!job) return <Navigate to="/m" replace />;
  const p = jobProperty(job);
  const finish = finishOf(job);

  return (
    <div className="screen-enter flex flex-1 flex-col">
      <ScreenHeader title="Rate the cleaning" onBack={() => navigate(`/m/jobs/${job.id}`)} backLabel="Job" />
      <div className="flex flex-col gap-6 px-4 pb-8 pt-2">
        <div>
          <StatusBadge tone="ok" label="Ready for guest" />
          <h2 className="mt-3 text-title font-bold">{p.street}, {p.unit}</h2>
          <p className="tnum text-body text-muted">
            {jobService(job).name} · ready {duration(job.checkin - finish)} before the {clock(job.checkin)} check-in
          </p>
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
          {job.rooms.map((r) =>
            r.photo ? (
              <figure key={r.id} className="m-0 w-32 shrink-0">
                <img src={r.photo} alt={`${r.name} after cleaning`} className="aspect-[4/3] w-full rounded-card border border-line object-cover" />
                <figcaption className="mt-1 text-caption text-muted">{r.name}</figcaption>
              </figure>
            ) : null,
          )}
        </div>

        <section aria-labelledby="rate-h">
          <h2 id="rate-h" className="text-headline font-bold">
            How did {PEOPLE[job.patronId].name.split(' ')[0]} do?
          </h2>
          <div className="mt-2">
            <StarRating value={stars} onChange={setStars} label="Rate the cleaning" />
          </div>
        </section>

        <TextArea label="Comment (optional)" value={comment} onChange={setComment} placeholder="What went well, what to do differently" hint="The cleaner sees your rating and comment." />
      </div>
      <div className="sticky bottom-0 z-sticky mt-auto border-t border-line bg-surface px-4 pb-8 pt-3 shadow-footer">
        <Button
          block
          disabled={stars === 0}
          onClick={() => {
            rate(job.id, stars, comment);
            toast('Rating sent');
            navigate('/m');
          }}
        >
          Send rating
        </Button>
      </div>
    </div>
  );
};
