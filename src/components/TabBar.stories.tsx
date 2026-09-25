import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Briefcase, CalendarCheck, Home, MessageCircle, User, Wallet } from 'lucide-react';
import { TabBar } from './TabBar';
import { PhoneWidth } from '../design-system/docs-blocks';

const meta = {
  title: 'Components/Tab bar',
  component: TabBar,
  decorators: [(S) => <PhoneWidth><S /></PhoneWidth>],
  parameters: { docs: { description: { component: 'Labeled tabs, max 4 per role, icon plus text.' } } },
} satisfies Meta<typeof TabBar>;
export default meta;
type Story = StoryObj;

export const Example: Story = {
  render: () => {
    const [m, setM] = useState('today');
    const [p, setP] = useState('jobs');
    return (
      <div className="flex flex-col gap-6">
        <TabBar
          active={m}
          onSelect={setM}
          items={[
            { key: 'today', label: 'Today', icon: CalendarCheck },
            { key: 'properties', label: 'Properties', icon: Home },
            { key: 'bookings', label: 'Bookings', icon: Briefcase },
            { key: 'account', label: 'Account', icon: User },
          ]}
        />
        <TabBar
          active={p}
          onSelect={setP}
          items={[
            { key: 'jobs', label: 'Jobs', icon: Briefcase, badge: 1 },
            { key: 'messages', label: 'Messages', icon: MessageCircle },
            { key: 'earnings', label: 'Earnings', icon: Wallet },
            { key: 'profile', label: 'Profile', icon: User },
          ]}
        />
      </div>
    );
  },
};
