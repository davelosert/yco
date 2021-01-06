const { allSpaces, allWindows } = require('../../src/shared/yabaiCommands');

exports.createFakeYabaiQuery = ({ spacesResult = [], windowsResult = [] }) => {
  return async (cmd) => {
    if (cmd === allSpaces()) {
      return spacesResult;
    }

    if (cmd === allWindows()) {
      return windowsResult;
    }
  };
};
