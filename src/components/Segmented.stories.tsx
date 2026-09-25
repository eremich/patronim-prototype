import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Segmented } from './Segmented';
import { PhoneWidth } from '../design-system/docs-blocks';

const meta = {
  title: 'Components/Segmented',
  component: Segmented,
  decorators: [(S) => <PhoneWidth><S /></PhoneWidth>],
  parameters: { docs: { description: { component: 'Switches between views of one list (Today / Upcoming / Done). Counts use tabular numerals.' } } },
} satisfies Meta<typeof Segmented>;
export default meta;
type Story = StoryObj;

export const Example: Story = {
  render: () => {
    const [v, setV] = useState<'today' | 'upcoming' | 'done'>('today');
    return (
      <Segmented
        label="Jobs"
        value={v}
        onChange={setV}
        options={[
          { key: 'today', label: 'Today', count: 3 },
          { key: 'upcoming', label: 'Upcoming', count: 2 },
          { key: 'done', label: 'Done' },
        ]}
      />
    );
  },
};
