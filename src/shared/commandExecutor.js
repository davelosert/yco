import * as childProcess from 'child_process';
import * as util from 'util';

const execRaw = util.promisify(childProcess.exec);

export const execute = async function (cmd) {
  const result = await execRaw(cmd);
  if (result.stderr) {
    throw new Error(`Error occured: ${result.stderr}`);
  }

  return result.stdout;
};

export const execAndParseJSONResult = async function (cmd) {
  const result = await execute(cmd);
  return JSON.parse(result);
};

export const executeMultipleCommands = async function (cmds) {
  for (const command of cmds) {
    try {
      await execute(command);
    } catch (error) {
      console.error(`Error with command [${command}]: `, error);
      throw error;
    }
  }
};
