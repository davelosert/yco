import { always, curry, flatten, pipe, subtract, times } from 'ramda';

const yabaiCreateSpace = 'yabai -m space --create';
const yabaiDestroySpace = spaceIndex => `yabai -m space ${spaceIndex} --destroy`;
const yabaiCreateSpaceAndMove = (spaceIndex, displayIndex) => () => [yabaiCreateSpace, yabaiMoveSpaceToDisplay(spaceIndex, displayIndex)];

export const generateDestroyCommands = curry((startIndex, count) => times(subtract(startIndex))(count).map(yabaiDestroySpace));
export const generateCreateCommands = times(always(yabaiCreateSpace))
export const generateCreateAndMoveCommands = (newSpaceIndex, displayNumber) => pipe(
  times(yabaiCreateSpaceAndMove(newSpaceIndex, displayNumber)),
  flatten
);

export const yabaiMoveSpaceToDisplay = curry((spaceIndex, displayIndex) => `yabai -m space ${spaceIndex} --display ${displayIndex}`);
