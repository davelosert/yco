const { createParallelExec } = require('../../../shared/createParalellExec');
const { openAndWait } = require('./openAndWait');
const { withChildProcessExec } = require('../../../shared/withChildProcessExec');

const timeoutOpts = {
  waitFor: 500,
  timeoutAfter: 30000
};

const openMissingWindows = async (yabaiAdapter, layoutConfig, generalConfigs) => {
  const parallelExec = withChildProcessExec(createParallelExec);
  await openAndWait(yabaiAdapter, parallelExec, timeoutOpts, layoutConfig, generalConfigs);
};

module.exports = {
  openMissingWindows
};
