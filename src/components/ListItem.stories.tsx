import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';
import { Card } from './Card';
import { ListItem } from './ListItem';
import { PhoneWidth } from '../design-system/docs-blocks';

const meta = {
  title: 'Components/List item',
  component: ListItem,
  decorators: [(S) => <PhoneWidth><S /></PhoneWidth>],
  parameters: { docs: { description: { component: 'Row with leading, title, subtitle and trailing slots. Pressable rows get a chevron.' } } },
} satisfies Meta<typeof ListItem>;
export default meta;
type Story = StoryObj;

export const Example: Story = {
  render: () => (
    <Card padded={false} className="px-4">
      <ListItem divider leading={<Avatar initials="AM" name="Avi Mizrahi" />} title="Avi Mizrahi" subtitle="Cleaner · 4.9 rating" onClick={() => {}} />
      <ListItem divider title="Payment method" subtitle="Visa •••• 4242" trailing="Change" />
      <ListItem title="Earnings this month" trailing={<span className="tnum font-bold">₪6,840</span>} />
    </Card>
  ),
};
