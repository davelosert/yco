const { allWindows } = require('../../../shared/yabaiCommands');
const { createOpenCommands } = require('./createOpenCommands');
const { getAllApps } = require('../domain/LayoutConfig');
const { getMissingWindows } = require('./getMissingWindows');
const { wait } = require('../../../shared/wait');


const createErrorTimer = (delay) => {
  let timeoutId;
  const promise = new Promise(resolve => {
    timeoutId = setTimeout(resolve, delay);
  }).then(() => {
    throw new Error('Opening windows took too long.');
  });

  return {
    promise,
    clear: () => clearTimeout(timeoutId)
  };
};

const openAndWait = async (yabaiAdapter, parallelExec, timerOpts, layoutConfig) => {
  const errorTimer = createErrorTimer(timerOpts.timeoutAfter);
  await Promise.race([startWaitingLoop(), errorTimer.promise]);
  errorTimer.clear();

  async function startWaitingLoop() {
    let firstRun = true;

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
        parallelExec(createOpenCommands(missingWindows));
        firstRun = false;
      }

      await wait(timerOpts.waitFor);
    }
  }
};


module.exports = {
  openAndWait
};
