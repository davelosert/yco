const { applyLayoutCommand } = require('./applyLayoutCommand');
const { createConfigsCommand } = require('./createConfigsCommand');
const { buntstift } = require('buntstift');
const { runCli } = require('command-line-interface');
const { globalOptions } = require('../cli/globalOptions');

const yco = {
  name: 'yco',
  description: 'Make Yabai and SKHD Configuration easy with a single tool.',
  optionDefinitions: [
    ...globalOptions,
    {
      name: 'version',
      description: 'Print the current version of yco to the console.',
      type: 'boolean',
      alias: 'v'
    }
  ],

  subcommands: {
    [applyLayoutCommand.name]: applyLayoutCommand,
    [createConfigsCommand.name]: createConfigsCommand
  },

  async handle({ options, getUsage, ancestors }) {
    if (options.version) {
      buntstift.info(require('../../package.json').version);
      process.exit(0);
    }


    const subCommandName = await buntstift.select('Select Subcommand', Object.values(this.subcommands).map(command => command.name));

    if (subCommandName === 'help') {
      buntstift.info(getUsage({ commandPath: [...ancestors, 'yco'] }));
      process.exit(0);
    }

    await runCli({ rootCommand: this.subcommands[subCommandName], argv: process.argv });
  }
};

exports.runYco = async function runYco() {
  await runCli({ rootCommand: yco, argv: process.argv });
};
