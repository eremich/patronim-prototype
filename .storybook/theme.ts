import { create } from 'storybook/theming/create';
import { color, font } from '../src/design-system/tokens.js';

// The Storybook UI itself is themed from the same token file as the app.
export const patronimTheme = create({
  base: 'light',
  brandTitle: 'Patronim · Design system',
  brandUrl: './',
  brandTarget: '_self',

  colorPrimary: color.navy.value,
  colorSecondary: color.navy.value,

  appBg: color.canvas.value,
  appContentBg: color.surface.value,
  appPreviewBg: color.surface.value,
  appBorderColor: color.line.value,
  appBorderRadius: 12,

  textColor: color.ink.value,
  textMutedColor: color.muted.value,
  barTextColor: color.muted.value,
  barSelectedColor: color.navy.value,
  barBg: color.surface.value,

  inputBg: color.surface.value,
  inputBorder: color.line.value,
  inputTextColor: color.ink.value,
  inputBorderRadius: 12,

  fontBase: font.family,
  fontCode: 'ui-monospace, Consolas, monospace',
});
