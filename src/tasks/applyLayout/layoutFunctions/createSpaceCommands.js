import { flatten, sum, times } from 'ramda';
import { generateFocusDisplayCommand, generateCreateCommands, generateDestroyCommands } from '../../../shared/yabaiComands';

const getDisplayNumberFoIndex = displayIndex => displayIndex + 1;
const generateCreateSpaces = (spaceDiff, displayIndex) => [
  generateFocusDisplayCommand(getDisplayNumberFoIndex(displayIndex)),
  ...generateCreateCommands(spaceDiff)
];

const noActionNeeded = spaceDiff => spaceDiff === 0;
const spaceCreationNeeded = spaceDiff => spaceDiff >= 1;

export const createSpaceCommands = ({ spacesPlan, spacesCount }) => {

  const commandsArray = spacesPlan.map((spaceDiff, displayIndex) => {
    if (noActionNeeded(spaceDiff)) {
      return [];
    }

    if (spaceCreationNeeded(spaceDiff)) {
      return generateCreateSpaces(spaceDiff, displayIndex);
    }

    const getAnticipatedIndexForDisplay = displayIndex => {
      const prevSpaceCount = sum(times(index => spacesCount[index] + spacesPlan[index], displayIndex));
      return prevSpaceCount + spacesCount[displayIndex];
    };

    return generateDestroyCommands(getAnticipatedIndexForDisplay(displayIndex), spaceDiff * -1);
  });

  return flatten(commandsArray);
};
