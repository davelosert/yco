const childProcess = require('child_process');
const util = require('util');

const execRaw = util.promisify(childProcess.exec);

const execute = async function (cmd) {
  const result = await execRaw(cmd);
  if (result.stderr) {
    throw new Error(`Error occured: ${result.stderr}`);
  }

  return result.stdout;
};

exports.withChildProcessExec = (func) => func(execute);
