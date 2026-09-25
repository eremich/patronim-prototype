import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from './Button';
import { Sheet } from './Sheet';
import { Stepper } from './Stepper';

const meta = {
  title: 'Components/Sheet',
  component: Sheet,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Bottom sheet for short, focused tasks: price breakdown, report missing item, needs redo. Slides up in 300 ms on the drawer curve and closes in 200 ms. Escape, backdrop tap and the close button all dismiss. Focus moves into the sheet.',
      },
      story: { inline: false, iframeHeight: 560 },
    },
  },
  args: { open: true, title: 'Report missing item', onClose: () => {}, children: null },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    const [n, setN] = useState(1);
    return (
      <div className="relative h-[560px] w-[390px] overflow-hidden bg-canvas p-4">
        <Button onClick={() => setOpen(true)}>Open sheet</Button>
        <div id="sheet-root" className="pointer-events-none absolute inset-0" />
        <Sheet
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          description="The manager sees it on the job and it's added to the next delivery."
          footer={<Button block onClick={() => setOpen(false)}>Report missing item</Button>}
        >
          <Stepper label="Towels" value={n} onChange={setN} min={1} />
        </Sheet>
      </div>
    );
  },
};
