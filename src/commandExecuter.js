import * as childProcess from 'child_process';
import * as util from 'util';

const execRaw = util.promisify(childProcess.exec);

const execute = async function (cmd) {
  const result = await execRaw(cmd);
  if (result.stderr) {
    throw new Error(`Error occured: ${result.stderr}`);
  }

  return result.stdout;
};

export const execYabai = async function (cmd) {
  const result = await execute(`yabai ${cmd}`);
  return JSON.parse(result);
};
