import { addons } from 'storybook/manager-api';
import { patronimTheme } from './theme';

addons.setConfig({ theme: patronimTheme, sidebar: { showRoots: true } });
