import { addIndex, pipe, reduce, sum, take, unnest } from 'ramda';

const reduceIndexed = addIndex(reduce);
const createMoveWindowCommand = (windowId, targetSpaceIndex) => `yabai -m window ${windowId} --space ${targetSpaceIndex}`;

// const calculateSpaceDiff = (display, spacePlan) =>  
const sumSpacePlanTillDisplay = (display, spacePlan) => pipe(
  take(display - 1),
  sum
)(spacePlan);

export const createWindowCommands = ({ desiredWindowLayout, spacesPlan }) => pipe(
  unnest,
  reduceIndexed((commands, windows, targetSpaceIndex) => {
    windows.forEach(window => {
      const spacesDiff = sumSpacePlanTillDisplay(window.display, spacesPlan);
      const calculatedSourceSpace = window.space + spacesDiff;
      if (calculatedSourceSpace !== (targetSpaceIndex + 1)) {
        commands.push(createMoveWindowCommand(window.id, targetSpaceIndex + 1));
      }
    });
    return commands;
  }, [])
)(desiredWindowLayout);
