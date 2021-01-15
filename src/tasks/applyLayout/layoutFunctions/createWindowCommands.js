const { pipe, reduce, sum, take, unnest } = require('ramda');
const { generateMoveWindowToSpace } = require('../../../shared/yabaiCommands');

// const calculateSpaceDiff = (display, spacePlan) =>  
const getInsertedOrRemovedSpaces = (display, spacePlan) => pipe(
  take(display - 1),
  sum
)(spacePlan);


const attachTargetDisplayAndSpace = desiredWindowLayout => {
  let absoluteSpaceCounter = 0;
  return desiredWindowLayout.map((spaces, targetDisplayIndex) => {
    return spaces.map((windows) => {
      absoluteSpaceCounter++;
      return windows.map(window => ({
        ...window,
        targetSpace: absoluteSpaceCounter,
        targetDisplay: targetDisplayIndex + 1
      }));
    });
  });
};


exports.createWindowCommands = ({ desiredWindowLayout, spacesPlan }) => pipe(
  attachTargetDisplayAndSpace,
  unnest,
  reduce((commands, windows) => {
    windows.forEach(window => {
      const spacesDiff = getInsertedOrRemovedSpaces(window.display, spacesPlan);
      const anticipatedSourceSpace = window.space + spacesDiff;
      if (anticipatedSourceSpace !== window.targetSpace || window.display !== window.targetDisplay) {
        commands.push(generateMoveWindowToSpace(window.id, window.targetSpace));
      }
    });
    return commands;
  }, [])
)(desiredWindowLayout);
