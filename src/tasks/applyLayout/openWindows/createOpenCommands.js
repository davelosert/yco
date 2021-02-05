const R = require('ramda');


const createOpenCommand = app => `open -n -g -a "${app}"`;
const createOpenCommands = (missingWindows) => {
  return missingWindows.reduce((commands, missingWindow) => {
    return R.concat(
      commands,
      R.times(() => createOpenCommand(missingWindow.app), missingWindow.times)
    );
  }, []);
};

module.exports = {
  createOpenCommands
};
