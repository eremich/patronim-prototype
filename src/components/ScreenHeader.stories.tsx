import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';
import { ScreenHeader } from './ScreenHeader';
import { SectionTitle } from './SectionTitle';
import { PhoneWidth } from '../design-system/docs-blocks';

const meta = {
  title: 'Components/Screen header',
  component: ScreenHeader,
  decorators: [(S) => <PhoneWidth><S /></PhoneWidth>],
  parameters: { docs: { description: { component: 'Large title for tab roots, compact bar with back for pushed screens.' } } },
} satisfies Meta<typeof ScreenHeader>;
export default meta;
type Story = StoryObj;

export const Example: Story = {
  render: () => (
    <div className="flex flex-col gap-4 bg-canvas">
      <ScreenHeader large title="Today" subtitle="Thu 1 Oct · 11:40" trailing={<Avatar initials="DL" name="Dana Levi" />} />
      <ScreenHeader title="Book a cleaning" onBack={() => {}} />
      <SectionTitle trailing={<span className="text-caption text-muted">Required</span>}>Timing</SectionTitle>
    </div>
  ),
};
