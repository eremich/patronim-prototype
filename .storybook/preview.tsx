import type { Preview } from '@storybook/react-vite';
import '../src/index.css';
import './docs.css';
import { patronimTheme } from './theme';

const preview: Preview = {
  // Every component gets a generated Docs page: description, live examples with source, props table.
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="font-sans text-ink">
        <Story />
        {/* Bottom sheets portal here, like in the app's phone frame */}
        <div id="sheet-root" className="pointer-events-none fixed inset-0 z-sheet" />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
    backgrounds: { disabled: true },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i }, sort: 'requiredFirst' },
    docs: { theme: patronimTheme, toc: { headingSelector: 'h2, h3', title: 'On this page' } },
    options: {
      storySort: {
        order: ['Introduction', 'Guidelines', 'Foundations', 'Components', 'Patterns'],
        method: 'alphabetical',
      },
    },
    a11y: { test: 'todo' },
  },
};

export default preview;
