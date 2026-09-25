import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TextArea } from './TextArea';
import { PhoneWidth } from '../design-system/docs-blocks';

const meta = {
  title: 'Components/Text area',
  component: TextArea,
  decorators: [(S) => <PhoneWidth><S /></PhoneWidth>],
  parameters: { docs: { description: { component: 'Multi-line note with a visible label and optional hint.' } } },
} satisfies Meta<typeof TextArea>;
export default meta;
type Story = StoryObj;

export const Example: Story = {
  render: () => {
    const [v, setV] = useState('');
    return <TextArea label="Note for the cleaner" value={v} onChange={setV} placeholder="Where to find things, what to check" hint="Visible to the cleaner only" />;
  },
};
