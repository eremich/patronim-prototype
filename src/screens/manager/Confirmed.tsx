import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { SectionTitle } from '../../components/SectionTitle';
import { Timeline } from '../../components/Timeline';
import { PEOPLE } from '../../data/catalog';
import { jobService, jobTitle, useJob } from '../../app/hooks';
import { INSPECTION_MIN } from '../../lib/health';
import { money } from '../../lib/pricing';
import { clock, dayLabel, dayOf, duration } from '../../lib/time';

export const Confirmed = () => {
  const { id } = useParams();
  const job = useJob(id);
  const navigate = useNavigate();
  if (!job) return <Navigate to="/m" replace />;
  const end = job.start + job.durationMin;

  return (
    <div className="screen-enter flex flex-1 flex-col px-4 pb-8 pt-6">
      <div className="flex flex-col items-center text-center">
        <span className="flex size-16 items-center justify-center rounded-chip bg-ok/10">
          <CheckCircle2 aria-hidden className="size-9 text-ok" strokeWidth={2} />
        </span>
        <h1 className="mt-4 text-display font-bold">Cleaning booked</h1>
        <p className="tnum mt-1 text-body text-muted">
          {jobService(job).name} · {jobTitle(job)}
        </p>
        <p className="tnum mt-1 text-body font-bold text-ink">
          Ready before the guest arrives at {clock(job.checkin)}, {dayLabel(dayOf(job.checkin)).toLowerCase()}
        </p>
      </div>

      <Card className="mt-8">
        <SectionTitle>What happens next</SectionTitle>
        <Timeline
          steps={[
            { title: 'Cleaner assigned', detail: `${PEOPLE[job.patronId].name} · rated 4.9`, state: 'done' },
            { title: 'Cleaning', detail: `Starts ${clock(job.start)}, about ${duration(job.durationMin)}. Photos of every room.`, state: 'next' },
            { title: 'Inspection', detail: `${PEOPLE[job.inspectorId].name} checks every room, ${INSPECTION_MIN} min`, state: 'next' },
            { title: 'Ready for guest', detail: `By ${clock(end + INSPECTION_MIN)}. We tell you the moment it's ready.`, state: 'next' },
          ]}
        />
      </Card>
      <p className="tnum mt-3 text-center text-caption text-muted">Paid {money(job.price)} · Receipt sent to dana.levi@mail.com</p>

      <div className="mt-auto flex flex-col gap-2 pt-8">
        <Button block onClick={() => navigate(`/m/jobs/${job.id}`, { replace: true })}>
          Track cleaning
        </Button>
        <Button block variant="ghost" onClick={() => navigate('/m', { replace: true })}>
          Back to today
        </Button>
      </div>
    </div>
  );
};
