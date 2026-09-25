import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Stepper } from './Stepper';
import { PhoneWidth } from '../design-system/docs-blocks';

const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  decorators: [(S) => <PhoneWidth><S /></PhoneWidth>],
  parameters: { docs: { description: { component: 'Quantity for extras and missing items. 44 px buttons, live value, min and max.' } } },
} satisfies Meta<typeof Stepper>;
export default meta;
type Story = StoryObj;

export const Example: Story = {
  render: () => {
    const [n, setN] = useState(1);
    return <Stepper label="Linen sets" hint="Sheets, duvet cover, 2 pillowcases" price="₪45 each" value={n} onChange={setN} />;
  },
};
