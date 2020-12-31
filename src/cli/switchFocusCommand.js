const { allWindows } = require('../shared/yabaiCommands');
const { buntstift } = require('buntstift');
const { createYabaiAdapter } = require('../shared/createYabaiAdapter');
const { switchFocus } = require('../tasks/switchFocus');
const { withChildProcessExec } = require('../shared/withChildProcessExec');
const { uniq } = require('ramda');

exports.switchFocusCommand = {
  name: 'switch-focus',
  description: 'Move windows to preconfigured spaces according to a given layout.',
  remarks: 'yco <command-name> [--flag...]',
  optionDefinitions: [
    {
      name: 'app',
      description: 'Name of the app to focus (needs to match app returned from "yabai -m query --windows")',
      type: 'string',
      alias: 'a'
    },
    {
      name: 'debug',
      description: 'Don\'t execute any action. Just print what would be done.',
      type: 'boolean',
      defaultValue: false
    }
  ],

  async handle({ options }) {
    const yabaiAdapter = withChildProcessExec(createYabaiAdapter);
    let appToFocus = options.app;

    // If debug mode is enabled, overwrite apply-command and just print out stuff
    if (options.debug) {
      yabaiAdapter.apply = (cmds) => {
        buntstift.info('The following commands would have been executed: ');
        buntstift.newLine();
        cmds.forEach(cmd => buntstift.list(cmd, { level: 1 }));
      };
    }

    if (!appToFocus) {
      const currentWindows = await yabaiAdapter.query(allWindows());
      const appOptions = uniq(currentWindows.map(window => `${window.app}`));
      appToFocus = await buntstift.select('Which app do you want to focus?', appOptions);
    }

    switchFocus({
      windowQuery: {
        app: appToFocus
      },
      yabaiAdapter
    });
  }
};
