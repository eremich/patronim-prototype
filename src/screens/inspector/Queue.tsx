import { useNavigate } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import { EmptyState } from '../../components/EmptyState';
import { JobCard } from '../../components/JobCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionTitle } from '../../components/SectionTitle';
import { PEOPLE } from '../../data/catalog';
import type { Job } from '../../data/types';
import { RoleAvatar } from '../../app/Shell';
import { jobService, jobTitle, windowProps } from '../../app/hooks';
import { roomsProgress } from '../../lib/health';
import { stageView } from '../../lib/status';
import { NOW, clock, dayOf, duration } from '../../lib/time';
import { useStore } from '../../store/useStore';

const InspectorCard = ({ job, onOpen }: { job: Job; onOpen?: () => void }) => {
  const st = stageView(job);
  const r = roomsProgress(job);
  const cleaner = PEOPLE[job.patronId].name;
  const meta =
    job.status === 'inspection'
      ? job.reworkCount > 0
        ? `${cleaner} fixed ${job.reworkCount === 1 ? 'the item' : 'items'} you sent back`
        : `${cleaner} · ${job.rooms.filter((x) => x.photo).length} rooms with photos`
      : job.status === 'cleaning'
        ? `${cleaner} · ${r.done} of ${r.total} rooms done`
        : job.status === 'rework'
          ? `${cleaner} is fixing what you sent back`
          : `${cleaner} starts ${clock(job.start)}`;
  return (
    <JobCard
      title={jobTitle(job)}
      subtitle={
        <span className="tnum">
          {jobService(job).name} · guest at {clock(job.checkin)}, in {duration(job.checkin - NOW)}
        </span>
      }
      status={{ label: st.label, tone: job.status === 'inspection' ? 'brand' : 'neutral', icon: st.icon }}
      window={windowProps(job)}
      meta={meta}
      onClick={onOpen}
    />
  );
};

export const Queue = () => {
  const navigate = useNavigate();
  const jobs = useStore((s) => s.jobs);
  useStore((s) => s.now);
  const today = jobs.filter((j) => dayOf(j.checkin) === 0).sort((a, b) => a.checkin - b.checkin);
  const ready = today.filter((j) => j.status === 'inspection');
  const later = today.filter((j) => j.status === 'cleaning' || j.status === 'rework' || j.status === 'scheduled');

  return (
    <div className="screen-enter flex flex-1 flex-col">
      <ScreenHeader large title="Queue" subtitle="Thu 1 Oct · Noa Shapiro" trailing={<RoleAvatar role="inspector" />} />
      <div className="flex flex-col gap-6 px-4 pb-6">
        <section aria-labelledby="ready-h">
          <SectionTitle id="ready-h" trailing={<span className="text-caption text-muted">By guest check-in</span>}>
            Ready to inspect
          </SectionTitle>
          {ready.length === 0 ? (
            <EmptyState icon={ClipboardList} title="Nothing to inspect yet" body="Jobs appear here the moment a cleaner sends them for inspection." />
          ) : (
            <ul className="flex flex-col gap-3">
              {ready.map((j) => (
                <li key={j.id}>
                  <InspectorCard job={j} onOpen={() => navigate(`/i/inspect/${j.id}`)} />
                </li>
              ))}
            </ul>
          )}
        </section>
        {later.length > 0 && (
          <section aria-labelledby="later-h">
            <SectionTitle id="later-h">Still cleaning</SectionTitle>
            <ul className="flex flex-col gap-3">
              {later.map((j) => (
                <li key={j.id}>
                  <InspectorCard job={j} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};
