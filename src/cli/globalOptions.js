exports.globalOptions = [
  {
    name: 'debug',
    description: 'Don\'t execute any action. Just print what would be done.',
    type: 'boolean',
    defaultValue: false
  },
  {
    name: 'config',
    description: 'Path to the yc configuration file. Defaults to ~/.config/yabai/yco.config.json',
    type: 'string',
    alias: 'c'
  }
];
