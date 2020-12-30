const { applyLayout } = require('../tasks/applyLayout');
const { buntstift } = require('buntstift');
const { getConfig } = require('../shared/getConfig');
const { globalOptions } = require('./globalOptions');
const { withChildProcessExec } = require('../shared/withChildProcessExec');
const { createYabaiAdapter } = require('../shared/createYabaiAdapter');

exports.applyLayoutCommand = {
  name: 'apply-layout',
  description: 'Move windows to preconfigured spaces according to a given layout.',
  remarks: 'yco <command-name> [--flag...]',
  optionDefinitions: [
    ...globalOptions,
    {
      name: 'name',
      description: 'Name of the layout to apply (key of the layout in your yco.config.json).',
      type: 'string',
      alias: 'n'
    }
  ],

  async handle({ options }) {
    const config = await getConfig({ configPath: options.config });

    let desiredLayoutName = options.name;
    if (!desiredLayoutName) {
      desiredLayoutName = await buntstift.select('Choose Layout to apply: ', Object.keys(config.layouts));
    }

    const layoutConfig = config.layouts[desiredLayoutName];
    if (!layoutConfig) {
      buntstift.error(`Layout with name '${desiredLayoutName}' does not exist in your config.`);
      process.exit(1);
    }

    const yabaiAdapter = withChildProcessExec(createYabaiAdapter);

    // If debug mode is enabled, overwrite apply-command and just print out stuff
    if (options.debug) {
      yabaiAdapter.apply = (cmds) => {
        buntstift.info('The following commands would have been executed: ');
        buntstift.newLine();
        cmds.forEach(cmd => buntstift.list(cmd, { level: 1 }));
      };
    }

    applyLayout({
      layoutConfig,
      yabaiAdapter
    });
  }
};
