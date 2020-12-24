import { addIndex, pipe, reduce, sum, take, unnest } from 'ramda';
import { generateMoveWindowToSpace } from '../../../shared/yabaiComands';

const reduceIndexed = addIndex(reduce);

// const calculateSpaceDiff = (display, spacePlan) =>  
const getInsertedOrRemovedSpaces = (display, spacePlan) => pipe(
  take(display - 1),
  sum
)(spacePlan);

export const createWindowCommands = ({ desiredWindowLayout, spacesPlan }) => pipe(
  unnest,
  reduceIndexed((commands, windows, targetSpaceIndex) => {
    windows.forEach(window => {
      const spacesDiff = getInsertedOrRemovedSpaces(window.display, spacesPlan);
      const anticipatedSourceSpace = window.space + spacesDiff;
      if (anticipatedSourceSpace !== (targetSpaceIndex + 1)) {
        commands.push(generateMoveWindowToSpace(window.id, targetSpaceIndex + 1));
      }
    });
    return commands;
  }, [])
)(desiredWindowLayout);
