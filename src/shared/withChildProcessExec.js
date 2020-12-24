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

export const withChildProcessExec = (func) => func(execute);
