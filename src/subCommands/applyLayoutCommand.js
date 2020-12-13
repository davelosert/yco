import { applyWindowLayout } from '../tasks/applyLayout';
import { buntstift } from 'buntstift';
import { globalOptions } from '../globalOptions';
import { getConfig } from '../getConfig';

export const applyLayout = {
  name: 'applyLayout',
  description: 'Move windows to the configrued spaces of the given layout.',
  remarks: 'yco <command-name> [--flag...]',
  optionDefinitions: [
    ...globalOptions,
    {
      name: 'name',
      description: 'Name of the layout to apply',
      type: 'string',
      alias: 'n'
    },
  ],

  async handle({ options }) {
    const config = await getConfig(options.config);

    let desiredLayoutName = options.name;
    if (!desiredLayoutName) {
      desiredLayoutName = await buntstift.select('Choose Layout to apply: ', Object.keys(config.layouts));
    }

    applyWindowLayout({
      config,
      desiredLayoutName,
      isDebugMode: options.debug
    });
  }
};
