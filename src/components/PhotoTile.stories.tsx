import type { Meta, StoryObj } from '@storybook/react-vite';
import { PhotoTile } from './PhotoTile';
import { PhoneWidth } from '../design-system/docs-blocks';

const meta = {
  title: 'Components/Photo tile',
  component: PhotoTile,
  decorators: [(S) => <PhoneWidth><S /></PhoneWidth>],
  parameters: { docs: { description: { component: 'Shows an after photo with a caption, or becomes the add-photo button when empty.' } } },
} satisfies Meta<typeof PhotoTile>;
export default meta;
type Story = StoryObj;

export const Example: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-3">
      <PhotoTile src="/mock/room-bathroom.svg" alt="Bathroom after cleaning" caption="After" />
      <PhotoTile alt="Add after photo" required onAdd={() => {}} />
    </div>
  ),
};
