import type { Meta, StoryObj } from '@storybook/react-vite';
import { Timeline } from './Timeline';
import { PhoneWidth } from '../design-system/docs-blocks';

const meta = {
  title: 'Components/Timeline',
  component: Timeline,
  decorators: [(S) => <PhoneWidth><S /></PhoneWidth>],
  parameters: { docs: { description: { component: 'Ordered steps of what happens next. Numbers carry meaning here, so they are shown.' } } },
} satisfies Meta<typeof Timeline>;
export default meta;
type Story = StoryObj;

export const Example: Story = {
  render: () => (
    <Timeline
      steps={[
        { title: 'Cleaner assigned', detail: 'Avi Mizrahi', state: 'done' },
        { title: 'Cleaning', detail: '12:00–14:30', state: 'current' },
        { title: 'Inspection', detail: 'Noa Shapiro checks every room', state: 'next' },
        { title: 'Ready for guest', detail: 'By 15:00', state: 'next' },
      ]}
    />
  ),
};
