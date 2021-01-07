const childProcess = require('child_process');
const path = require('path');
const util = require('util');

const execRaw = util.promisify(childProcess.exec);
const ycoBin = path.join(__dirname, '..', '..', 'src', 'bin', 'yco.js');

exports.executeYco = async function ({ cmd, options }) {
  try {
    const result = await execRaw(`node ${ycoBin} ${cmd}`, options);
    return {
      output: result.stdout,
      exitCode: 0
    };
  } catch (error) {
    return {
      output: error.stderr,
      exitCode: error.code
    };
  }
};
