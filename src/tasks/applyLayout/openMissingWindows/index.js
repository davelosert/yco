const { withChildProcessExec } = require('../../../shared/withChildProcessExec');
const { createParallelExec } = require('../../../shared/createParalellExec');
const { openAndWait } = require('./openAndWait');

const timeoutOpts = {
  waitFor: 500,
  timeoutAfter: 30000
};

const openMissingWindows = async (yabaiAdapter, layoutConfig) => {
  const parallelExec = withChildProcessExec(createParallelExec);
  await openAndWait(yabaiAdapter, parallelExec, timeoutOpts, layoutConfig);
};

module.exports = {
  openMissingWindows
};
