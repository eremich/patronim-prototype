import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { StarRating } from './StarRating';
import { PhoneWidth } from '../design-system/docs-blocks';

const meta = {
  title: 'Components/Star rating',
  component: StarRating,
  decorators: [(S) => <PhoneWidth><S /></PhoneWidth>],
  parameters: { docs: { description: { component: '1–5 rating as a radio group with a word for each value.' } } },
} satisfies Meta<typeof StarRating>;
export default meta;
type Story = StoryObj;

export const Example: Story = {
  render: () => {
    const [v, setV] = useState(4);
    return <StarRating value={v} onChange={setV} label="Rate the cleaning" />;
  },
};
