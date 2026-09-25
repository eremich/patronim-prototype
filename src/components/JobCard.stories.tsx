import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertTriangle, RotateCcw, Sparkles } from 'lucide-react';
import { JobCard } from './JobCard';
import { StatusBadge } from './StatusBadge';
import { PhoneWidth } from '../design-system/docs-blocks';

const h = (hh: number, mm = 0) => hh * 60 + mm;

const meta = {
  title: 'Components/Job card',
  component: JobCard,
  decorators: [(S) => <PhoneWidth><S /></PhoneWidth>],
  parameters: {
    docs: {
      description: {
        component:
          'One turnover in a list, used by all three roles. The manager version leads with the property and status; the cleaner version leads with time left ("Guest arrives in 3 h 10 min"); zip code is secondary. Risk and late tones change the border, and the meta line says why in words.',
      },
    },
  },
  args: {
    title: '164 Hayarkon St, Apt 12',
    subtitle: 'Turnover clean · guest arrives 14:15',
    status: { label: 'At risk', tone: 'risk', icon: AlertTriangle },
    window: { checkout: h(11), checkin: h(14, 15), start: h(12), finish: h(14), now: h(11, 40), health: 'risk' },
    meta: 'No time left for inspection',
    tone: 'risk',
  },
} satisfies Meta<typeof JobCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ManagerAtRisk: Story = {};

export const ManagerCleaning: Story = {
  args: {
    title: '3 Bograshov St, Apt 1',
    subtitle: 'Turnover clean · guest arrives 15:00',
    status: { label: 'Cleaning', tone: 'brand', icon: Sparkles },
    window: { checkout: h(10), checkin: h(15), start: h(10, 15), finish: h(12, 5), now: h(11, 40), health: 'ok', phase: 'cleaning', progress: 0.9 },
    meta: 'Avi Mizrahi · 3 of 4 rooms done',
    tone: 'default',
  },
};

export const CleanerRework: Story = {
  args: {
    lead: (
      <div className="mb-2 flex items-center justify-between">
        <StatusBadge tone="late" icon={RotateCcw} label="1 item to redo" />
        <span className="tnum text-caption font-bold">Guest arrives in 45 min</span>
      </div>
    ),
    title: '77 Ben Yehuda St, Apt 4',
    subtitle: '2 bedrooms · 70 m² · zip 6343503',
    status: undefined,
    window: { checkout: h(11), checkin: h(15), start: h(11, 40), finish: h(14, 35), now: h(14, 15), health: 'ok', phase: 'cleaning', progress: 0.95 },
    meta: '“Streaks on the mirror above the sink.”',
    tone: 'late',
  },
};
