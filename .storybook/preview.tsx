import type { Preview } from '@storybook/react-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import '../src/index.css';
import './docs.css';
import { patronimTheme } from './theme';

// Docs pages are always light (Storybook's docs theme), so the preview must not follow the OS dark mode.
// Stories switch themes with the toolbar, which overrides this attribute.
if (!document.documentElement.dataset.theme) document.documentElement.dataset.theme = 'light';

const preview: Preview = {
  // Every component gets a generated Docs page: description, live examples with source, props table.
  tags: ['autodocs'],
  decorators: [
    // Same switch as the app: data-theme on <html> flips the token variables
    withThemeByDataAttribute({ themes: { light: 'light', dark: 'dark' }, defaultTheme: 'light', attributeName: 'data-theme' }),
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
