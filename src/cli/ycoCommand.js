import { applyLayoutCommand as applyLayout } from '../cli/applyLayoutCommand';
import { buntstift } from 'buntstift';
import { runCli } from 'command-line-interface';
import { globalOptions } from '../cli/globalOptions';

const yco = {
  name: 'yco',
  description: 'The Yabai-Configurator.',
  remarks: `
    Select on of the commands to execute.
  `,
  optionDefinitions: [
    ...globalOptions
  ],

  subcommands: {
    [applyLayout.name]: applyLayout
  },

  async handle({ options }) {
    const subCommand = await buntstift.select('Select Subcommand', Object.values(this.subcommands).map(command => command.name));
    await this.subcommands[subCommand].handle({ options });
  }
};

export async function runYco() {
  await runCli({ rootCommand: yco, argv: process.argv });
}
