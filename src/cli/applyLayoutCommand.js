import { applyLayout } from '../tasks/applyLayout';
import { buntstift } from 'buntstift';
import { globalOptions } from './globalOptions';
import { getConfig } from '../getConfig';

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
    const config = await getConfig(options.config);

    let desiredLayoutName = options.name;
    if (!desiredLayoutName) {
      desiredLayoutName = await buntstift.select('Choose Layout to apply: ', Object.keys(config.layouts));
    }


    const layoutConfig = config.layouts[desiredLayoutName];
    if (!layoutConfig) {
      buntstift.error(`Layout with name '${desiredLayoutName}' does not exist in your config.`);
      process.exit(1);
    }

    applyLayout({
      layoutConfig,
      isDebugMode: options.debug
    });
  }
};
