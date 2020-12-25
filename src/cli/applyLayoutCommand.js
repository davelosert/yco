import { applyLayout } from '../tasks/applyLayout';
import { buntstift } from 'buntstift';
import { getConfig } from '../shared/getConfig';
import { globalOptions } from './globalOptions';
import { withChildProcessExec } from '../shared/withChildProcessExec';
import { createYabaiAdapter } from '../shared/createYabaiAdapter';

export const applyLayoutCommand = {
  name: 'apply-layout',
  description: 'Move windows to the configrued spaces of the given layout.',
  remarks: 'yco <command-name> [--flag...]',
  optionDefinitions: [
    ...globalOptions,
    {
      name: 'name',
      description: 'Name of the layout to apply',
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
