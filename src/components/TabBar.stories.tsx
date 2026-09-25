import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { Briefcase, CalendarCheck, Home, MessageCircle, User, Wallet } from 'lucide-react';
import { TabBar } from './TabBar';

const meta = {
  title: 'Components/Tab bar',
  component: TabBar,
  parameters: {
    docs: {
      description: {
        component:
          'Floating glass tab bar in the iOS 26 style: a capsule 16 px from the edges, floating over content that scrolls underneath. Labeled tabs, max 4 per role, icon plus text. The selected tab sits in a brand-tint capsule that slides to the new tab (260 ms, instant with reduced motion). Glass (material.glass token) is reserved for this floating chrome only, never for cards.',
      },
    },
  },
} satisfies Meta<typeof TabBar>;
export default meta;
type Story = StoryObj;

const MANAGER = [
  { key: 'today', label: 'Today', icon: CalendarCheck },
  { key: 'properties', label: 'Properties', icon: Home },
  { key: 'bookings', label: 'Bookings', icon: Briefcase },
  { key: 'account', label: 'Account', icon: User },
];

const PATRON = [
  { key: 'jobs', label: 'Jobs', icon: Briefcase, badge: 1 },
  { key: 'messages', label: 'Messages', icon: MessageCircle },
  { key: 'earnings', label: 'Earnings', icon: Wallet },
  { key: 'profile', label: 'Profile', icon: User },
];

/** Scrollable phone-sized frame so the glass has something to show through */
const Frame = ({ children }: { children: ReactNode }) => (
  <div className="relative h-[520px] w-[390px] overflow-hidden rounded-card border border-line bg-canvas">
    <div className="scroll-area h-full overflow-y-auto px-4 pb-28 pt-4">
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} className="mb-3 rounded-card border border-line bg-surface p-4">
          <div className="text-headline font-bold">{['3 Weizmann St', '164 Hayarkon St', '3 Bograshov St'][i % 3]}</div>
          <div className="mt-2 h-3 rounded-bar bg-ok/60" style={{ width: `${40 + ((i * 17) % 50)}%` }} />
        </div>
      ))}
    </div>
    <div className="absolute inset-x-0 bottom-0 px-4 pb-5">{children}</div>
  </div>
);

export const OverContent: Story = {
  name: 'Floating over content',
  render: () => {
    const [m, setM] = useState('today');
    return (
      <Frame>
        <TabBar active={m} onSelect={setM} items={MANAGER} />
      </Frame>
    );
  },
};

export const WithBadge: Story = {
  name: 'Patron, with badge',
  render: () => {
    const [p, setP] = useState('jobs');
    return (
      <Frame>
        <TabBar active={p} onSelect={setP} items={PATRON} />
      </Frame>
    );
  },
};
