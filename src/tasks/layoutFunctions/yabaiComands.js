import { always, curry, subtract, times } from 'ramda';

const yabaiCreateSpace = 'yabai -m space --create';
const yabaiDestroySpace = spaceIndex => `yabai -m space ${spaceIndex} --destroy`;

export const getAllSpaces = () => 'yabai -m query --spaces';

export const getAllWindows = () => 'yabai -m query --windows';

export const generateDestroyCommands = curry(
  (startIndex, count) => times(subtract(startIndex))(count).map(yabaiDestroySpace));

export const generateCreateCommands = times(always(yabaiCreateSpace));

export const generateFocusDisplayCommand = displayNumber => `yabai -m display --focus ${displayNumber}`;

export const yabaiMoveSpaceToDisplay = curry((spaceIndex, displayIndex) => `yabai -m space ${spaceIndex} --display ${displayIndex}`);
