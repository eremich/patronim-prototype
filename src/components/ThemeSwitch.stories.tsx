import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemeSwitch, type ThemeValue } from './ThemeSwitch';
import { PhoneWidth } from '../design-system/docs-blocks';

const meta = {
  title: 'Components/Theme switch',
  component: ThemeSwitch,
  decorators: [(S) => <PhoneWidth><S /></PhoneWidth>],
  parameters: {
    docs: {
      description: {
        component:
          'Appearance setting: System follows the phone, Light and Dark force a theme. Used on each role profile and in the prototype side panel. A radio group, one choice at a time.',
      },
    },
  },
} satisfies Meta<typeof ThemeSwitch>;
export default meta;
type Story = StoryObj;

export const Example: Story = {
  render: () => {
    const [v, setV] = useState<ThemeValue>('system');
    return <ThemeSwitch value={v} onChange={setV} />;
  },
};
