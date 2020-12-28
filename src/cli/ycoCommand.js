import { applyLayoutCommand } from './applyLayoutCommand';
import { createConfigsCommand } from './createConfigsCommand';
import { buntstift } from 'buntstift';
import { runCli } from 'command-line-interface';
import { globalOptions } from '../cli/globalOptions';

const yco = {
  name: 'yco',
  description: 'Make Yabai and SKHD Configuration easy with a single tool.',
  optionDefinitions: [
    ...globalOptions
  ],

  subcommands: {
    [applyLayoutCommand.name]: applyLayoutCommand,
    [createConfigsCommand.name]: createConfigsCommand
  },

  async handle({ getUsage, ancestors }) {
    const subCommandName = await buntstift.select('Select Subcommand', Object.values(this.subcommands).map(command => command.name));

    if (subCommandName === 'help') {
      buntstift.info(getUsage({ commandPath: [...ancestors, 'yco'] }));
      process.exit(0);
    }

    await runCli({ rootCommand: this.subcommands[subCommandName], argv: process.argv });
  }
};

export async function runYco() {
  await runCli({ rootCommand: yco, argv: process.argv });
}
