import { flatten, sum, times } from 'ramda';
import { generateCreateAndMoveCommands, generateCreateCommands, generateDestroyCommands } from './yabaiComands';

const isMainDisplay = displayIndex => displayIndex === 0;
const getDisplayNumberFoIndex = displayIndex => displayIndex + 1;

const noActionNeeded = spaceDiff => spaceDiff === 0;
const spaceCreationNeeded = spaceDiff => spaceDiff >= 1;

export const createSpaceCommands = ({ spacesPlan, spacesCount }) => {
  const getAnticipatedIndexForDisplay = displayIndex => {
    const prevSpaceCount = sum(times(index => spacesCount[index] + spacesPlan[index], displayIndex));

    return prevSpaceCount + spacesCount[displayIndex];
  };

  const generateCreateSpaces = displayIndex => {
    const spaceDiff = spacesPlan[displayIndex];

    if (isMainDisplay(displayIndex)) {
      return generateCreateCommands(spaceDiff);
    }
    const mainDisplayNewSpaceIndex = spacesPlan[0] + spacesCount[0] + 1;

    return generateCreateAndMoveCommands(mainDisplayNewSpaceIndex, getDisplayNumberFoIndex(displayIndex))(spaceDiff);
  };

  const commandsArray = spacesPlan.map((spaceDiff, displayIndex) => {
    if (noActionNeeded(spaceDiff)) {
      return [];
    }

    if (spaceCreationNeeded(spaceDiff)) {
      return generateCreateSpaces(displayIndex);
    }

    return generateDestroyCommands(getAnticipatedIndexForDisplay(displayIndex), spaceDiff * -1);
  });

  return flatten(commandsArray);
};
