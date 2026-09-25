import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClipboardCheck, RotateCcw, Sparkles } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

const meta = {
  title: 'Components/Status badge',
  component: StatusBadge,
  args: { label: 'Ready', tone: 'ok' },
  parameters: {
    docs: {
      description: {
        component:
          'Tinted pill with an icon and a label. Status is never communicated by color alone. Not clickable, no hover. Text uses the -ink shades so it passes AA on the tint.',
      },
    },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const JobStatuses: Story = {
  name: 'Job statuses (manager view)',
  render: () => (
    <div className="flex max-w-md flex-wrap gap-2">
      <StatusBadge tone="brand" label="Scheduled" />
      <StatusBadge tone="brand" label="Cleaning" icon={Sparkles} />
      <StatusBadge tone="brand" label="Inspection" icon={ClipboardCheck} />
      <StatusBadge tone="risk" label="Rework in progress" icon={RotateCcw} />
      <StatusBadge tone="risk" label="At risk" />
      <StatusBadge tone="late" label="At risk" />
      <StatusBadge tone="ok" label="Ready" />
      <StatusBadge tone="neutral" label="Done" />
    </div>
  ),
};

export const Inspection: Story = {
  render: () => (
    <div className="flex gap-2">
      <StatusBadge tone="ok" label="Passed" />
      <StatusBadge tone="late" label="Needs redo" />
      <StatusBadge tone="late" label="1 item to redo" icon={RotateCcw} />
    </div>
  ),
};
