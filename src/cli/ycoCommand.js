const { applyLayoutCommand } = require('./applyLayoutCommand');
const { buntstift } = require('buntstift');
const { createConfigsCommand } = require('./createConfigsCommand');
const { globalOptions } = require('../cli/globalOptions');
const { runCli } = require('command-line-interface');
const { switchFocusCommand } = require('./switchFocusCommand');

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
    [createConfigsCommand.name]: createConfigsCommand,
    [switchFocusCommand.name]: switchFocusCommand
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
