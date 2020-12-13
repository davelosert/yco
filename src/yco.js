#! /usr/bin/env node
import { applyLayout } from './subCommands/applyLayoutCommand';
import { buntstift } from 'buntstift';
import { runCli } from 'command-line-interface';
import { globalOptions } from './globalOptions';

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
    applyLayout
  },

  async handle({ options }) {
    const subCommand = await buntstift.select('Select Subcommand', Object.values(this.subcommands).map(command => command.name));
    await this.subcommands[subCommand].handle({ options });
  }
};

(async function start() {
  await runCli({ rootCommand: yco, argv: process.argv });
})();
