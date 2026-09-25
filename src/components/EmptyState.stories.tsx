import type { Meta, StoryObj } from '@storybook/react-vite';
import { CalendarPlus } from 'lucide-react';
import { Button } from './Button';
import { EmptyState } from './EmptyState';
import { PhoneWidth } from '../design-system/docs-blocks';

const meta = {
  title: 'Components/Empty state',
  component: EmptyState,
  decorators: [(S) => <PhoneWidth><S /></PhoneWidth>],
  parameters: { docs: { description: { component: 'Points to the next action instead of saying "nothing here".' } } },
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj;

export const Example: Story = {
  render: () => (
    <EmptyState
      icon={CalendarPlus}
      title="No cleanings booked"
      body="Book one for your next checkout."
      action={<Button block>Book a cleaning</Button>}
    />
  ),
};
