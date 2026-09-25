import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, RotateCcw } from 'lucide-react';
import { Banner } from '../../components/Banner';
import { EmptyState } from '../../components/EmptyState';
import { JobCard } from '../../components/JobCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Segmented } from '../../components/Segmented';
import { SkeletonCard } from '../../components/Skeleton';
import { StatusBadge } from '../../components/StatusBadge';
import { sizeLabel } from '../../data/catalog';
import type { Job } from '../../data/types';
import { RoleAvatar } from '../../app/Shell';
import { jobProperty, jobTitle, useFirstLoad, windowProps } from '../../app/hooks';
import { health, roomsProgress } from '../../lib/health';
import { stageView } from '../../lib/status';
import { NOW, clock, dayOf, duration, when } from '../../lib/time';
import { cx } from '../../lib/cx';
import { redoItems, useStore } from '../../store/useStore';

type Seg = 'today' | 'upcoming' | 'done';

/** Time left is the headline of a cleaner's job card */
const TimeLeft = ({ job }: { job: Job }) => {
  const left = job.checkin - NOW;
  const redo = redoItems(job).filter((i) => !i.fixed).length;
  if (job.status === 'rework' && redo > 0)
    return (
      <div className="mb-2 flex items-center justify-between gap-2">
        <StatusBadge tone="late" icon={RotateCcw} label={`${redo} item to redo`} />
        <span className="tnum text-caption font-bold text-ink">Guest arrives in {duration(left)}</span>
      </div>
    );
  if (dayOf(job.checkin) > 0) return <p className="tnum mb-1 text-headline font-bold text-ink">Guest arrives {when(job.checkin)}</p>;
  if (job.status === 'ready' || job.status === 'inspection') return null;
  return (
    <p className={cx('tnum mb-1 text-headline font-bold', health(job) === 'ok' ? 'text-ink' : health(job) === 'late' ? 'text-late-ink' : 'text-risk-ink')}>
      Guest arrives in {duration(left)}
    </p>
  );
};

export const PatronJobCard = ({ job, onOpen }: { job: Job; onOpen: () => void }) => {
  const p = jobProperty(job);
  const st = stageView(job);
  const r = roomsProgress(job);
  const redo = redoItems(job).find((i) => !i.fixed);
  const meta =
    job.status === 'rework' && redo ? (
      <span className="flex gap-3">
        {redo.redoPhoto && <img src={redo.redoPhoto} alt={`Inspector photo: ${redo.label}`} className="size-14 shrink-0 rounded-control border border-line object-cover" />}
        <span className="text-body text-ink">
          <strong className="block text-caption font-bold text-late-ink">
            {redo.roomName}: {redo.label.toLowerCase()}
          </strong>
          “{redo.redoNote}”
        </span>
      </span>
    ) : job.status === 'cleaning'
      ? `${r.done} of ${r.total} rooms done`
      : job.status === 'scheduled'
        ? `Start ${clock(job.start)} · ${duration(job.durationMin)} of work`
        : job.status === 'inspection'
          ? 'Sent for inspection'
          : job.status === 'ready'
            ? 'Passed inspection'
            : undefined;
  return (
    <JobCard
      lead={<TimeLeft job={job} />}
      title={jobTitle(job)}
      subtitle={
        <>
          {sizeLabel(p)} · <span className="tnum">zip {p.zip}</span>
        </>
      }
      status={job.status === 'rework' ? undefined : { label: st.label, tone: st.tone, icon: st.icon }}
      window={windowProps(job)}
      meta={meta}
      tone={job.status === 'rework' ? 'late' : 'default'}
      onClick={onOpen}
    />
  );
};

export const Jobs = () => {
  const navigate = useNavigate();
  const all = useStore((s) => s.jobs).filter((j) => j.patronId === 'avi');
  const offline = useStore((s) => s.offline);
  useStore((s) => s.now);
  const loading = useFirstLoad('p-jobs');
  const [seg, setSeg] = useState<Seg>('today');

  // Rework goes to the top, then by deadline
  const byDeadline = (a: Job, b: Job) => Number(b.status === 'rework') - Number(a.status === 'rework') || a.checkin - b.checkin;
  const lists: Record<Seg, Job[]> = {
    today: all.filter((j) => dayOf(j.checkin) === 0 && j.status !== 'ready').sort(byDeadline),
    upcoming: all.filter((j) => dayOf(j.checkin) > 0).sort(byDeadline),
    done: all.filter((j) => j.status === 'ready'),
  };
  const list = lists[seg];

  return (
    <div className="screen-enter flex flex-1 flex-col">
      <ScreenHeader large title="Jobs" subtitle="Thu 1 Oct · Avi Mizrahi" trailing={<RoleAvatar role="patron" />} />
      <div className="flex flex-1 flex-col gap-4 px-4 pb-6">
        {offline && (
          <Banner tone="offline" title="You're offline">
            Keep working. Checklist and photos sync when you're back online.
          </Banner>
        )}
        <Segmented
          label="Jobs"
          value={seg}
          onChange={setSeg}
          options={[
            { key: 'today', label: 'Today', count: lists.today.length },
            { key: 'upcoming', label: 'Upcoming', count: lists.upcoming.length },
            { key: 'done', label: 'Done', count: lists.done.length },
          ]}
        />
        {loading ? (
          <div aria-busy="true" aria-label="Loading jobs" className="flex flex-col gap-3">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : list.length === 0 ? (
          <EmptyState
            icon={Coffee}
            title={seg === 'today' ? 'No jobs today' : seg === 'upcoming' ? 'Nothing upcoming yet' : 'No finished jobs yet'}
            body={seg === 'today' ? 'New jobs appear here the moment a manager books. Check Upcoming for the rest of the week.' : 'Jobs show up here as they are booked and finished.'}
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {list.map((j) => (
              <li key={j.id}>
                <PatronJobCard job={j} onOpen={() => navigate(`/p/jobs/${j.id}`)} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
