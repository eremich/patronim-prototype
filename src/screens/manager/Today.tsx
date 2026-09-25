import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CalendarPlus, CheckCircle2, Plus, Star } from 'lucide-react';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { JobCard } from '../../components/JobCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionTitle } from '../../components/SectionTitle';
import { SkeletonCard } from '../../components/Skeleton';
import { PEOPLE } from '../../data/catalog';
import type { Job } from '../../data/types';
import { RoleAvatar } from '../../app/Shell';
import { jobService, jobTitle, useFirstLoad, windowProps } from '../../app/hooks';
import { health, projectedFinish, roomsProgress } from '../../lib/health';
import { statusView } from '../../lib/status';
import { clock, dayOf, duration, when } from '../../lib/time';
import { useStore } from '../../store/useStore';

/** The one line under the bar that tells the manager what matters now */
export const managerMeta = (job: Job) => {
  const h = health(job);
  const cleaner = PEOPLE[job.patronId].name;
  if (job.status === 'ready')
    return job.rating ? (
      <span className="flex items-center gap-1 font-medium text-ink">
        <Star aria-hidden className="size-3.5 fill-navy text-navy" /> You rated {job.rating} of 5
      </span>
    ) : (
      <span className="flex items-center gap-1 font-bold text-navy">
        <CheckCircle2 aria-hidden className="size-3.5 text-ok" /> Ready for guest · Rate the cleaning
      </span>
    );
  if (h !== 'ok' && job.status !== 'rework') {
    const f = projectedFinish(job);
    return (
      <span className={`flex items-center gap-1 font-bold ${h === 'late' ? 'text-late-ink' : 'text-risk-ink'}`}>
        <AlertTriangle aria-hidden className="size-3.5" />
        {f > job.checkin ? `Finishes ${clock(f)}, ${duration(f - job.checkin)} after check-in` : 'No time left for inspection'}
      </span>
    );
  }
  if (job.status === 'cleaning') {
    const r = roomsProgress(job);
    return `${cleaner} · ${r.done} of ${r.total} rooms done`;
  }
  if (job.status === 'inspection') return `${PEOPLE[job.inspectorId].name} is inspecting`;
  if (job.status === 'rework') return `Inspector sent 1 item back to ${cleaner.split(' ')[0]}`;
  return `${cleaner} · starts ${clock(job.start)}`;
};

export const ManagerJobCard = ({ job, onOpen }: { job: Job; onOpen: () => void }) => {
  const s = statusView(job);
  return (
    <JobCard
      title={jobTitle(job)}
      subtitle={`${jobService(job).name} · guest arrives ${dayOf(job.checkin) === 0 ? clock(job.checkin) : when(job.checkin)}`}
      status={{ label: s.label, tone: s.tone, icon: s.icon }}
      window={windowProps(job)}
      meta={managerMeta(job)}
      tone={s.tone === 'late' ? 'late' : s.tone === 'risk' ? 'risk' : 'default'}
      onClick={onOpen}
    />
  );
};

export const Today = () => {
  const navigate = useNavigate();
  const jobs = useStore((s) => s.jobs);
  const loading = useFirstLoad('m-today');
  const sorted = [...jobs].sort((a, b) => a.checkin - b.checkin);
  const today = sorted.filter((j) => dayOf(j.checkin) === 0);
  const later = sorted.filter((j) => dayOf(j.checkin) > 0);
  const atRisk = today.filter((j) => statusView(j).label === 'At risk').length;
  const ready = today.filter((j) => j.status === 'ready').length;

  return (
    <div className="screen-enter flex flex-1 flex-col">
      <ScreenHeader large title="Today" subtitle="Thu 1 Oct · Holiday week" trailing={<RoleAvatar role="manager" />} />
      <div className="flex flex-1 flex-col gap-6 px-4 pb-6">
        {loading ? (
          <div aria-busy="true" aria-label="Loading turnovers" className="flex flex-col gap-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            icon={CalendarPlus}
            title="No cleanings booked"
            body="Book one for your next checkout."
            action={
              <Button block icon={<Plus aria-hidden className="size-5" />} onClick={() => navigate('/m/book')}>
                Book a cleaning
              </Button>
            }
          />
        ) : (
          <>
            <Button block icon={<Plus aria-hidden className="size-5" />} onClick={() => navigate('/m/book')}>
              Book a cleaning
            </Button>
            <section aria-labelledby="today-h">
              <SectionTitle
                id="today-h"
                trailing={
                  <span className="tnum text-caption text-muted">
                    {today.length} turnovers{atRisk ? ` · ${atRisk} at risk` : ''}
                    {ready ? ` · ${ready} ready` : ''}
                  </span>
                }
              >
                By guest check-in
              </SectionTitle>
              <ul className="flex flex-col gap-3">
                {today.map((j) => (
                  <li key={j.id}>
                    <ManagerJobCard job={j} onOpen={() => navigate(j.status === 'ready' && !j.rating ? `/m/jobs/${j.id}/rate` : `/m/jobs/${j.id}`)} />
                  </li>
                ))}
              </ul>
            </section>
            {later.length > 0 && (
              <section aria-labelledby="later-h">
                <SectionTitle id="later-h">Coming up</SectionTitle>
                <ul className="flex flex-col gap-3">
                  {later.map((j) => (
                    <li key={j.id}>
                      <ManagerJobCard job={j} onOpen={() => navigate(`/m/jobs/${j.id}`)} />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};
