import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Start cleaning', variant: 'primary', size: 'lg' },
  parameters: {
    docs: {
      description: {
        component:
          'Says what happens: "Book cleaning", "Start cleaning", "Mark as ready". Primary is navy and appears once per screen. Scales to 0.97 on press. Heights: lg 52, md 44.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { icon: <Play aria-hidden className="size-5" /> } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'Report missing item' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'Message Avi' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Send back to cleaner' } };
export const Loading: Story = { args: { loading: true, children: 'Paying…' } };
export const Disabled: Story = { args: { disabled: true, children: 'Submit for inspection' } };
export const WithTrailingIcon: Story = { args: { children: 'Review booking', trailing: <ArrowRight aria-hidden className="size-5" /> } };

export const States: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-3">
      {(['primary', 'secondary', 'ghost', 'danger'] as const).map((v) => (
        <div key={v} className="flex flex-col gap-2">
          <Button variant={v} size="md">Default</Button>
          <Button variant={v} size="md" id={`hover-${v}`}>Hover</Button>
          <Button variant={v} size="md" id={`focus-${v}`}>Focus</Button>
          <Button variant={v} size="md" id={`active-${v}`}>Pressed</Button>
          <Button variant={v} size="md" disabled>Disabled</Button>
        </div>
      ))}
    </div>
  ),
  parameters: {
    pseudo: {
      hover: ['#hover-primary', '#hover-secondary', '#hover-ghost', '#hover-danger'],
      focusVisible: ['#focus-primary', '#focus-secondary', '#focus-ghost', '#focus-danger'],
      active: ['#active-primary', '#active-secondary', '#active-ghost', '#active-danger'],
    },
  },
};
