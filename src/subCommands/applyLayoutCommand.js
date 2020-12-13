import { applyWindowLayout } from '../tasks/applyLayout';
import { buntstift } from 'buntstift';
import { readFileSync } from 'fs';
import { globalOptions } from '../globalOptions';

export const applyLayout = {
  name: 'applyLayout',
  description: 'Move windows to the configrued spaces of the given layout.',
  remarks: `
    Select a Layout to continue...
  `,

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
    console.log('Options: ', options);
    const configRaw = await readFileSync(options.config);
    const config = JSON.parse(configRaw);

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
