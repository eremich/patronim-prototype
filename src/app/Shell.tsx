import { useEffect, useRef, type ReactNode } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BatteryFull, Briefcase, CalendarCheck, ClipboardList, History, Home, Map, MessageCircle, Signal, User, Wallet, Wifi } from 'lucide-react';
import { TabBar, type TabItem } from '../components/TabBar';
import { Toast } from '../components/Toast';
import { Avatar } from '../components/Avatar';
import { Sheet } from '../components/Sheet';
import { ListItem } from '../components/ListItem';
import { ThemeSwitch } from '../components/ThemeSwitch';
import { PEOPLE, ME } from '../data/catalog';
import { SCENARIOS } from '../data/scenarios';
import type { Role, Scenario } from '../data/types';
import { useStore } from '../store/useStore';
import { clock, NOW } from '../lib/time';
import { cx } from '../lib/cx';
import { redoItems } from '../store/useStore';

export const ROLE_HOME: Record<Role, string> = { manager: '/m', patron: '/p', inspector: '/i' };
const ROLE_LABEL: Record<Role, string> = { manager: 'Property manager', patron: 'Patron (cleaner)', inspector: 'Quality controller' };

const TABS: Record<Role, (TabItem & { path: string })[]> = {
  manager: [
    { key: 'today', label: 'Today', icon: CalendarCheck, path: '/m' },
    { key: 'properties', label: 'Properties', icon: Home, path: '/m/properties' },
    { key: 'bookings', label: 'Bookings', icon: Briefcase, path: '/m/bookings' },
    { key: 'account', label: 'Account', icon: User, path: '/m/account' },
  ],
  patron: [
    { key: 'jobs', label: 'Jobs', icon: Briefcase, path: '/p' },
    { key: 'messages', label: 'Messages', icon: MessageCircle, path: '/p/messages' },
    { key: 'earnings', label: 'Earnings', icon: Wallet, path: '/p/earnings' },
    { key: 'profile', label: 'Profile', icon: User, path: '/p/profile' },
  ],
  inspector: [
    { key: 'queue', label: 'Queue', icon: ClipboardList, path: '/i' },
    { key: 'map', label: 'Map', icon: Map, path: '/i/map' },
    { key: 'history', label: 'History', icon: History, path: '/i/history' },
    { key: 'profile', label: 'Profile', icon: User, path: '/i/profile' },
  ],
};

const roleOfPath = (path: string): Role => (path.startsWith('/p') ? 'patron' : path.startsWith('/i') ? 'inspector' : 'manager');

const StatusBar = () => {
  const now = useStore((s) => s.now);
  return (
  <div aria-hidden className="status-bar flex h-12 shrink-0 items-end justify-between px-8 pb-1.5 text-body font-bold text-ink">
    <span className="tnum">{clock(now)}</span>
    <span className="flex items-center gap-1.5">
      <Signal className="size-4" strokeWidth={2.5} />
      <Wifi className="size-4" strokeWidth={2.5} />
      <BatteryFull className="size-5" strokeWidth={2} />
    </span>
  </div>
  );
};

/** Avatar in role home headers. Long-press opens the role switcher on mobile. */
export const RoleAvatar = ({ role }: { role: Role }) => {
  const setRoleSheet = useStore((s) => s.setRoleSheet);
  const timer = useRef<number>();
  const person = PEOPLE[ME[role]];
  const start = () => {
    timer.current = window.setTimeout(() => setRoleSheet(true), 550);
  };
  const cancel = () => window.clearTimeout(timer.current);
  return (
    <button
      type="button"
      aria-label={`${person.name}. Press and hold to switch role`}
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onContextMenu={(e) => e.preventDefault()}
      className="press select-none rounded-chip"
    >
      <Avatar initials={person.initials} name={person.name} />
    </button>
  );
};

const RoleSheet = ({ onPick }: { onPick: (r: Role) => void }) => {
  const open = useStore((s) => s.roleSheetOpen);
  const setRoleSheet = useStore((s) => s.setRoleSheet);
  return (
    <Sheet open={open} title="View as" onClose={() => setRoleSheet(false)}>
      {(Object.keys(ROLE_HOME) as Role[]).map((r) => (
        <ListItem key={r} divider leading={<Avatar initials={PEOPLE[ME[r]].initials} name={PEOPLE[ME[r]].name} size="sm" />} title={ROLE_LABEL[r]} subtitle={PEOPLE[ME[r]].name} onClick={() => onPick(r)} />
      ))}
    </Sheet>
  );
};

/** Desktop-only controls outside the phone frame. Not part of screenshots. */
const DeskPanel = ({ role, onPick }: { role: Role; onPick: (r: Role) => void }) => {
  const scenario = useStore((s) => s.scenario);
  const loadScenario = useStore((s) => s.loadScenario);
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const navigate = useNavigate();
  const jobs = useStore((s) => s.jobs);
  const counts = {
    patron: jobs.filter((j) => j.patronId === 'avi' && (j.status === 'rework' || j.status === 'scheduled')).length,
    inspector: jobs.filter((j) => j.status === 'inspection').length,
  };
  return (
    <aside className="desk-panel hidden w-64 shrink-0 flex-col gap-6 lg:flex">
      <div>
        <p className="text-title font-bold text-ink">Patronim</p>
        <p className="text-body text-muted">Redesign 2026 · clickable prototype</p>
      </div>
      <div>
        <p className="mb-2 text-caption font-bold text-ink">View as</p>
        <div className="flex flex-col gap-1">
          {(Object.keys(ROLE_HOME) as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={role === r}
              onClick={() => onPick(r)}
              className={cx(
                'press flex min-h-11 items-center gap-3 rounded-control px-3 text-left text-body transition-colors duration-150',
                role === r ? 'bg-surface font-bold text-navy' : 'font-medium text-ink hover:bg-surface/60',
              )}
            >
              <Avatar size="sm" initials={PEOPLE[ME[r]].initials} name={PEOPLE[ME[r]].name} />
              <span className="flex-1">{ROLE_LABEL[r]}</span>
              {r !== 'manager' && counts[r] > 0 && <span className="tnum rounded-chip bg-navy px-2 text-caption font-bold text-surface">{counts[r]}</span>}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="scenario" className="mb-2 block text-caption font-bold text-ink">
          Scenario
        </label>
        <select
          id="scenario"
          value={scenario}
          onChange={(e) => {
            loadScenario(e.target.value as Scenario);
            navigate(ROLE_HOME[role]);
          }}
          className="h-11 w-full rounded-control border border-line bg-surface px-3 text-body"
        >
          {SCENARIOS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <p className="mb-2 mt-5 text-caption font-bold text-ink">Theme</p>
        <ThemeSwitch value={theme} onChange={setTheme} label="Theme" />
        <p className="mt-2 text-caption text-muted">Clock frozen at Thu 1 Oct, {clock(NOW)}. Holiday week.</p>
      </div>
    </aside>
  );
};

const ToastViewport = () => {
  const toasts = useStore((s) => s.toasts);
  return (
    <div aria-live="polite" className="pointer-events-none absolute inset-x-4 bottom-28 z-toast flex flex-col items-center gap-2">
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} tone={t.tone} />
      ))}
    </div>
  );
};

export const Shell = ({ children }: { children?: ReactNode }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const setRole = useStore((s) => s.setRole);
  const jobs = useStore((s) => s.jobs);
  const role = roleOfPath(pathname);
  const main = useRef<HTMLElement>(null);

  const tabs = TABS[role];
  const activeTab = tabs.find((t) => t.path === pathname);
  const reworkBadge = jobs.filter((j) => j.patronId === 'avi' && j.status === 'rework' && redoItems(j).length).length;
  const items = tabs.map((t) => (role === 'patron' && t.key === 'jobs' ? { ...t, badge: reworkBadge } : t));

  useEffect(() => {
    main.current?.scrollTo({ top: 0 });
  }, [pathname]);

  const pick = (r: Role) => {
    setRole(r);
    navigate(ROLE_HOME[r]);
  };

  return (
    <div className="flex min-h-full items-center justify-center gap-16 phone:p-8">
      <DeskPanel role={role} onPick={pick} />
      <div
        id="phone"
        className="relative flex h-[100dvh] w-full flex-col overflow-clip bg-canvas phone:h-[844px] phone:w-[390px] phone:rounded-phone phone:shadow-phone"
      >
        <StatusBar />
        {/* With the floating tab bar, content scrolls under it; the bottom padding keeps the last item reachable */}
        <main ref={main} id="screen" className={cx('scroll-area relative flex flex-1 flex-col', activeTab && 'pb-24')}>
          {children ?? <Outlet />}
        </main>
        {activeTab && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-tabbar px-4 pb-[max(20px,env(safe-area-inset-bottom))]">
            <div className="pointer-events-auto">
              <TabBar items={items} active={activeTab.key} onSelect={(k) => navigate(tabs.find((t) => t.key === k)!.path)} />
            </div>
          </div>
        )}
        <div id="sheet-root" className="pointer-events-none absolute inset-0 z-sheet" />
        <ToastViewport />
        <RoleSheet onPick={pick} />
      </div>
    </div>
  );
};
