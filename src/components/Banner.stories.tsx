import type { Meta, StoryObj } from '@storybook/react-vite';
import { Banner } from './Banner';
import { PhoneWidth } from '../design-system/docs-blocks';

const meta = {
  title: 'Components/Banner',
  component: Banner,
  decorators: [(S) => <PhoneWidth><S /></PhoneWidth>],
  parameters: { docs: { description: { component: 'Inline message: info, risk, late (error), offline. Full tint with an icon, never a side stripe.' } } },
} satisfies Meta<typeof Banner>;
export default meta;
type Story = StoryObj;

export const Example: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Banner tone="info" title="Cleaner assigned">Avi Mizrahi will start at 12:00.</Banner>
      <Banner tone="risk" title="Not enough time before check-in">This clean takes 2 h 30 min plus 30 min inspection. The window leaves 1 h 30 min.</Banner>
      <Banner tone="late" title="Your card was declined">Try another card or pay by invoice.</Banner>
      <Banner tone="offline" title="You're offline">Photos will upload when you're back online.</Banner>
    </div>
  ),
};
