import type { Meta, StoryObj } from '@storybook/react-vite';
import { TurnoverWindowBar } from './TurnoverWindowBar';
import { PhoneWidth } from '../design-system/docs-blocks';

const h = (hh: number, mm = 0) => hh * 60 + mm;

const meta = {
  title: 'Components/Turnover window bar',
  component: TurnoverWindowBar,
  tags: ['!autodocs'],
  decorators: [(Story) => <PhoneWidth><div className="rounded-card border border-line bg-surface p-4"><Story /></div></PhoneWidth>],
  args: {
    checkout: h(11),
    checkin: h(15),
    start: h(12),
    finish: h(14, 30),
    now: h(11, 40),
    health: 'ok',
    progress: 0,
    phase: 'scheduled',
    variant: 'full',
  },
  argTypes: {
    checkout: { control: { type: 'range', min: h(8), max: h(14), step: 15 } },
    checkin: { control: { type: 'range', min: h(12), max: h(20), step: 15 } },
    progress: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
  },
} satisfies Meta<typeof TurnoverWindowBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scheduled: Story = {};

export const Cleaning: Story = { args: { phase: 'cleaning', start: h(10, 15), checkout: h(10), progress: 0.65, finish: h(12, 55) } };

export const AtRisk: Story = { name: 'At risk (no time to inspect)', args: { health: 'risk', checkin: h(14, 45), finish: h(14, 30) } };

export const RunningLate: Story = {
  name: 'Late (finishes after check-in)',
  args: { phase: 'cleaning', health: 'late', checkout: h(10), start: h(10, 30), checkin: h(13, 30), progress: 0.3, finish: h(14, 10) },
};

export const Inspection: Story = { args: { phase: 'inspection', checkout: h(10), start: h(10, 15), finish: h(11, 30) } };

export const Ready: Story = { args: { phase: 'ready', checkout: h(10), start: h(10, 15), finish: h(11, 20), now: h(11, 40) } };

export const Compact: Story = { args: { variant: 'compact', phase: 'cleaning', progress: 0.5 } };

export const CompactStates: Story = {
  name: 'Compact, all health states',
  render: () => (
    <div className="flex flex-col gap-4">
      <TurnoverWindowBar variant="compact" checkout={h(11)} checkin={h(15)} start={h(12)} finish={h(14, 30)} now={h(11, 40)} health="ok" />
      <TurnoverWindowBar variant="compact" checkout={h(11)} checkin={h(14)} start={h(12)} finish={h(14)} now={h(11, 40)} health="risk" />
      <TurnoverWindowBar variant="compact" checkout={h(10)} checkin={h(13, 30)} start={h(10, 30)} finish={h(14, 10)} now={h(11, 40)} health="late" phase="cleaning" progress={0.3} />
      <TurnoverWindowBar variant="compact" checkout={h(10)} checkin={h(15)} start={h(10, 15)} finish={h(11, 20)} health="ok" phase="ready" />
    </div>
  ),
};
