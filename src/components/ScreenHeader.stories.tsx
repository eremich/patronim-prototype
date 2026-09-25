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

export const LargeTitleCollapsing: Story = {
  name: 'Large title collapsing on scroll',
  parameters: {
    docs: {
      description: {
        story:
          'Scroll the frame. When the large title slides under the top edge, the same title appears in a compact 44 px bar (translucent canvas, hairline border). The bar overlays content, so nothing shifts. The compact title is aria-hidden: screen readers get one heading.',
      },
    },
  },
  render: () => (
    <div className="scroll-area relative h-[420px] w-[358px] overflow-y-auto rounded-card border border-line bg-canvas">
      <ScreenHeader large title="Today" subtitle="Thu 1 Oct · Holiday week" trailing={<Avatar initials="DL" name="Dana Levi" />} />
      <div className="flex flex-col gap-3 px-4 pb-6">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="h-24 rounded-card border border-line bg-surface" />
        ))}
      </div>
    </div>
  ),
};
