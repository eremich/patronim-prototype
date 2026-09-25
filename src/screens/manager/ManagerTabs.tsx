import { useNavigate } from 'react-router-dom';
import { Bell, CreditCard, FileText, HelpCircle, LogOut } from 'lucide-react';
import { Card } from '../../components/Card';
import { ListItem } from '../../components/ListItem';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionTitle } from '../../components/SectionTitle';
import { PROPERTIES, propertyTitle, sizeLabel } from '../../data/catalog';
import { RoleAvatar } from '../../app/Shell';
import { money } from '../../lib/pricing';
import { when } from '../../lib/time';
import { useStore } from '../../store/useStore';
import { ManagerJobCard } from './Today';

export const Properties = () => {
  const navigate = useNavigate();
  const jobs = useStore((s) => s.jobs);
  return (
    <div className="screen-enter px-4 pb-6">
      <ScreenHeader large title="Properties" subtitle={`${PROPERTIES.length} apartments in Tel Aviv`} trailing={<RoleAvatar role="manager" />} />
      <ul className="-mt-2 flex flex-col gap-3">
        {PROPERTIES.map((p) => {
          const next = jobs.filter((j) => j.propertyId === p.id && j.status !== 'ready').sort((a, b) => a.checkin - b.checkin)[0];
          return (
            <li key={p.id}>
              <Card padded={false} className="flex items-center gap-3 p-3">
                <img src={p.photo} alt="" className="size-16 rounded-control object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body font-bold">{propertyTitle(p)}</p>
                  <p className="text-caption text-muted">{sizeLabel(p)}</p>
                  <p className="tnum text-caption text-ink">{next ? `Next guest ${when(next.checkin)}` : 'No cleaning booked'}</p>
                </div>
                {!next && (
                  <button type="button" onClick={() => navigate('/m/book')} className="press min-h-11 rounded-control px-3 text-body font-bold text-navy hover:bg-navy-soft">
                    Book
                  </button>
                )}
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const Bookings = () => {
  const navigate = useNavigate();
  const jobs = useStore((s) => s.jobs);
  const upcoming = jobs.filter((j) => j.status !== 'ready').sort((a, b) => a.checkin - b.checkin);
  const done = jobs.filter((j) => j.status === 'ready');
  const spent = jobs.reduce((a, j) => a + j.price, 0);
  return (
    <div className="screen-enter flex flex-col gap-6 px-4 pb-6">
      <ScreenHeader large title="Bookings" subtitle={`This month ${money(spent + 4210)}`} trailing={<RoleAvatar role="manager" />} />
      <section className="-mt-4">
        <SectionTitle>Upcoming and in progress</SectionTitle>
        <ul className="flex flex-col gap-3">
          {upcoming.map((j) => (
            <li key={j.id}>
              <ManagerJobCard job={j} onOpen={() => navigate(`/m/jobs/${j.id}`)} />
            </li>
          ))}
          {upcoming.length === 0 && <p className="text-body text-muted">Nothing upcoming. Book a cleaning from Today.</p>}
        </ul>
      </section>
      {done.length > 0 && (
        <section>
          <SectionTitle>Ready</SectionTitle>
          <ul className="flex flex-col gap-3">
            {done.map((j) => (
              <li key={j.id}>
                <ManagerJobCard job={j} onOpen={() => navigate(`/m/jobs/${j.id}`)} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export const Account = () => (
  <div className="screen-enter flex flex-col gap-6 px-4 pb-6">
    <ScreenHeader large title="Account" subtitle="Dana Levi · Property manager" trailing={<RoleAvatar role="manager" />} />
    <Card padded={false} className="-mt-4 px-4">
      <ListItem divider leading={<CreditCard aria-hidden className="size-5 text-muted" />} title="Payment methods" subtitle="Visa •••• 4242, PayPal, invoice" onClick={() => {}} />
      <ListItem divider leading={<FileText aria-hidden className="size-5 text-muted" />} title="Invoices and receipts" subtitle="Sent to dana.levi@mail.com" onClick={() => {}} />
      <ListItem leading={<Bell aria-hidden className="size-5 text-muted" />} title="Notifications" subtitle="Ready, at risk, rework" onClick={() => {}} />
    </Card>
    <Card padded={false} className="px-4">
      <ListItem divider leading={<HelpCircle aria-hidden className="size-5 text-muted" />} title="Help and cancellation policy" onClick={() => {}} />
      <ListItem leading={<LogOut aria-hidden className="size-5 text-muted" />} title="Sign out" />
    </Card>
  </div>
);
