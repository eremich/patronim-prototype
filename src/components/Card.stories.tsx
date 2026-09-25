import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { PhoneWidth } from '../design-system/docs-blocks';

const meta = {
  title: 'Components/Card',
  component: Card,
  decorators: [(S) => <PhoneWidth><S /></PhoneWidth>],
  parameters: { docs: { description: { component: 'Surface on canvas with a hairline border and no shadow. Tones: default, risk, late, brand.' } } },
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj;

export const Example: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Card>Default: surface on canvas, hairline border, no shadow.</Card>
      <Card tone="risk">Risk tone border for jobs that need attention.</Card>
      <Card tone="late">Late tone border for rework.</Card>
    </div>
  ),
};
