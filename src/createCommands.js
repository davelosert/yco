import { times, flatten, pipe, sum } from 'ramda';
import { generateCreateCommands, generateCreateAndMoveCommands, generateDestroyCommands, } from './yabaiComands'

const isMainDisplay = displayIndex => displayIndex === 0;
const getDisplayNumberFoIndex = displayIndex => displayIndex + 1;

export const createSpaceCommands = ({ spacesPlan, spacesCount }) => {

  const getAnticipatedIndexForDisplay = displayIndex => {
    const prevSpaceCount = sum(times(index => spacesCount[index] + spacesPlan[index], displayIndex));
    return prevSpaceCount + spacesCount[displayIndex];
  }

  const generateCreateSpaces = displayIndex => {
    const spaceDiff = spacesPlan[displayIndex];
    if (isMainDisplay(displayIndex)) {
      return generateCreateCommands(spaceDiff);
    } else {
      const mainDisplayNewSpaceIndex = spacesPlan[0] + spacesCount[0] + 1;
      return generateCreateAndMoveCommands(mainDisplayNewSpaceIndex, getDisplayNumberFoIndex(displayIndex))(spaceDiff);
    }
  }

  const commandsArray = spacesPlan.map((spaceDiff, displayIndex) => {
    if (spaceDiff === 0) {
      return [];
    } else if (spaceDiff > 0) {
      return generateCreateSpaces(displayIndex);
    } else {
      return generateDestroyCommands(getAnticipatedIndexForDisplay(displayIndex), spaceDiff * -1);
    }
  });
  return flatten(commandsArray);
}
