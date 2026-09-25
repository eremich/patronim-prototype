import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkeletonCard } from './Skeleton';
import { PhoneWidth } from '../design-system/docs-blocks';

const meta = {
  title: 'Components/Skeleton',
  component: SkeletonCard,
  decorators: [(S) => <PhoneWidth><S /></PhoneWidth>],
  parameters: { docs: { description: { component: 'Loading placeholder shaped like the content. Pulses opacity only.' } } },
} satisfies Meta<typeof SkeletonCard>;
export default meta;
type Story = StoryObj;

export const Example: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  ),
};
