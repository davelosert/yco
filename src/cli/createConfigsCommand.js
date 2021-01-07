const { createSkhdConfig } = require('../tasks/createSkhdConfig');
const { buntstift } = require('buntstift');
const { getConfig } = require('../shared/getConfig');
const { globalOptions } = require('./globalOptions');
const { createFSAdapter } = require('../shared/createFSAdapter');

exports.createConfigsCommand = {
  name: 'create-configs',
  description: 'Extends your SKHD-Config with all shortcuts and commands from the YCO-Config.',
  optionDefinitions: [
    ...globalOptions,
  ],

  async handle({ options }) {
    const configResult = await getConfig({ configPath: options.config });
    const ycoConfig = configResult.content;

    const fsAdapter = createFSAdapter();

    if (options.debug) {
      fsAdapter.mkdir = async (path) => buntstift.list(`Create directory "${path}"`).line();
      fsAdapter.writeFile = async (path, content) => buntstift.list(`Create file "${path}" with content:`).newLine().info(`${content}`).line();
      fsAdapter.appendFile = async (path, content) => buntstift.list(`Append to file "${path}":`).newLine().info(`${content}`).line();

      buntstift.header('The following actions would be taken:');
    }

    await createSkhdConfig({ ycoConfig, fs: fsAdapter });
  }
};
