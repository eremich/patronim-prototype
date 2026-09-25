import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';
import { PhoneWidth } from '../design-system/docs-blocks';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  decorators: [(S) => <PhoneWidth><S /></PhoneWidth>],
  parameters: { docs: { description: { component: 'Initials on the brand tint. Sizes sm, md, lg.' } } },
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj;

export const Example: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar size="sm" initials="DL" name="Dana Levi" />
      <Avatar initials="AM" name="Avi Mizrahi" />
      <Avatar size="lg" initials="NS" name="Noa Shapiro" />
    </div>
  ),
};
