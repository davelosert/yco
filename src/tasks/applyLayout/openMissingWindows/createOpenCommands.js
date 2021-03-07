const R = require('ramda');


const getBinaryName = R.curry((binaryMap, window) => R.defaultTo(window.app, binaryMap[window.app]));
const createOpenCommand = app => `open -n -g -a "${app}"`;
const createOpenCommands = (missingWindows, binaryMap = {}) => {
  const getAppName = getBinaryName(binaryMap);

  return missingWindows.reduce((commands, missingWindow) => {
    return R.concat(
      commands,
      R.times(() => createOpenCommand(getAppName(missingWindow)), missingWindow.times)
    );
  }, []);
};

module.exports = {
  createOpenCommands
};
