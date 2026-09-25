import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Chip } from './Chip';
import { PhoneWidth } from '../design-system/docs-blocks';

const meta = {
  title: 'Components/Chip',
  component: Chip,
  decorators: [(S) => <PhoneWidth><S /></PhoneWidth>],
  parameters: { docs: { description: { component: 'Selectable pill for short choices (day, item type). Selected state uses the brand tint, a border and aria-pressed.' } } },
} satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj;

export const Example: Story = {
  render: () => {
    const [v, setV] = useState('today');
    return (
      <div className="flex flex-wrap gap-2">
        {[
          ['today', 'Today', 'Thu 1'],
          ['tomorrow', 'Tomorrow', 'Fri 2'],
          ['sat', 'Sat', '3 Oct'],
        ].map(([k, l, s]) => (
          <Chip key={k} label={l} sublabel={s} selected={v === k} onClick={() => setV(k)} />
        ))}
      </div>
    );
  },
};
