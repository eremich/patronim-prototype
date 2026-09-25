import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TimeSelect } from './TimeSelect';
import { halfHours } from '../lib/time';
import { PhoneWidth } from '../design-system/docs-blocks';

const meta = {
  title: 'Components/Time select',
  component: TimeSelect,
  decorators: [(S) => <PhoneWidth><S /></PhoneWidth>],
  parameters: { docs: { description: { component: 'Native select styled as a field so phones show their own time wheel. The required check-in shows a Required tag and an error that says how to fix it.' } } },
} satisfies Meta<typeof TimeSelect>;
export default meta;
type Story = StoryObj;

export const Example: Story = {
  render: () => {
    const [a, setA] = useState<number | null>(660);
    const [b, setB] = useState<number | null>(null);
    return (
      <div className="flex gap-3">
        <TimeSelect label="Guest checkout" value={a} options={halfHours()} onChange={setA} />
        <TimeSelect label="Guest check-in" required value={b} options={halfHours()} onChange={setB} error={b === null ? 'Add check-in time' : undefined} />
      </div>
    );
  },
};
