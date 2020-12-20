import { defaultConfigPath } from '../getConfig';

export const globalOptions = [
  {
    name: 'debug',
    description: 'Don\'t execute any action. Just print what would be done.',
    type: 'boolean',
    defaultValue: false
  },
  {
    name: 'config',
    description: 'Path to the yc configuration file. Defaults to ~/.config/yc/config.json',
    type: 'string',
    alias: 'c',
    defaultValue: defaultConfigPath
  }
];
