const { allWindows } = require('../../../shared/yabaiCommands');
const { createErrorTimer } = require('../../../shared/createErrorTimer');
const { createOpenCommands } = require('./createOpenCommands');
const { getAllApps } = require('../domain/LayoutConfig');
const { getMissingWindows } = require('./getMissingWindows');
const { wait } = require('../../../shared/wait');

const openAndWait = async (yabaiAdapter, parallelExec, timerOpts, layoutConfig, generalConfigs = {}) => {
  const errorTimer = createErrorTimer(timerOpts.timeoutAfter, new Error('Opening windows took too long.'));
  await Promise.race([startWaitingLoop(), errorTimer.promise]);
  errorTimer.clear();

  async function startWaitingLoop() {
    let firstRun = true;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const actualWindows = await yabaiAdapter.query(allWindows());
      const requiredWindows = getAllApps(layoutConfig);
      const missingWindows = getMissingWindows(actualWindows, requiredWindows);
      if (missingWindows.length === 0) {
        return;
      }

      if (firstRun) {
        // Fire and forget here - we are not intersted in when the commands resolve
        // as there is a huge delay between the open command returning and the window
        // being actually open
        parallelExec(createOpenCommands(missingWindows, generalConfigs.layoutModeBinaryMap));
        firstRun = false;
      }
      await wait(timerOpts.waitFor);
    }
  }
};


module.exports = {
  openAndWait
};
