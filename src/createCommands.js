import { times, always, curry, flatten, pipe, dec, subtract } from 'ramda';

const isMainDisplay = (displayIndex) => displayIndex === 1;
const yabaiCreateSpace = 'yabai -m space --create';
const yabaiMoveSpaceToDisplay = curry((spaceIndex, displayIndex) => `yabai -m space ${spaceIndex} --display ${displayIndex}`);
const yabaiCreateSpaceNonMainDisplay = (spaceIndex, displayIndex) => () => [yabaiCreateSpace, yabaiMoveSpaceToDisplay(spaceIndex, displayIndex)];
const yabaiDestroySpace = spaceIndex => `yabai -m space ${spaceIndex} --destroy`;
const createDestroyCommandTimes = curry((startIndex, count) => times(subtract(startIndex))(count).map(yabaiDestroySpace));


const generateCreateSpaceCommandsNonMainDisplay = (spaceIndex, displayIndex) => pipe(
  times(yabaiCreateSpaceNonMainDisplay(spaceIndex, displayIndex)),
  flatten
);
const generateCreateSpaceCommands = times(always(yabaiCreateSpace))

const calcCreatedSpaceIndex = (spacesPlan, spacesCount) => spacesPlan[0] + spacesCount[0] + 1;

export const createSpaceCommands = ({ spacesPlan, spacesCount }) => {
  const mainDisplayNewSpaceIndex = calcCreatedSpaceIndex(spacesPlan, spacesCount);
  return spacesPlan.reduce((commands, spaceDiff, index) => {
    if (spaceDiff === 0) {
      return commands;
    } else if (spaceDiff < 0) {
      return [...commands, ...createDestroyCommandTimes(spacesCount[index], spaceDiff * -1)];
    } else {
      const displayIndex = index + 1;
      if (isMainDisplay(displayIndex)) {
        return [...commands, ...generateCreateSpaceCommands(spaceDiff)];
      } else {
        return [...commands, ...generateCreateSpaceCommandsNonMainDisplay(mainDisplayNewSpaceIndex, displayIndex)(spaceDiff)]
      }
    }
  }, [])
}
