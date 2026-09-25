import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast } from './Toast';
import { PhoneWidth } from '../design-system/docs-blocks';

const meta = {
  title: 'Components/Toast',
  component: Toast,
  decorators: [(S) => <PhoneWidth><S /></PhoneWidth>],
  parameters: { docs: { description: { component: 'Short confirmation that repeats the action name ("Mark as ready" → "Marked as ready").' } } },
} satisfies Meta<typeof Toast>;
export default meta;
type Story = StoryObj;

export const Example: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Toast message="Sent for inspection" />
      <Toast message="Marked as ready" />
      <Toast tone="error" message="Photo didn't upload. Tap to retry." />
    </div>
  ),
};
