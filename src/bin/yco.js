#! /usr/bin/env node
import { applyLayoutCommand as applyLayout } from '../cli/applyLayoutCommand';
import { buntstift } from 'buntstift';
import { runCli } from 'command-line-interface';
import { globalOptions } from '../cli/globalOptions';

const yco = {
  name: 'yco',
  description: 'The Yabai-Configurator.',
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

(async function start() {
  await runCli({ rootCommand: yco, argv: process.argv });
})();
