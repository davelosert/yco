const { always, curry, subtract, times } = require('ramda');

const yabaiCreateSpace = 'yabai -m space --create';
const yabaiDestroySpace = spaceIndex => `yabai -m space ${spaceIndex} --destroy`;

exports.allSpaces = () => 'yabai -m query --spaces';

exports.allWindows = () => 'yabai -m query --windows';

exports.generateDestroyCommands = curry(
  (startIndex, count) => times(subtract(startIndex))(count).map(yabaiDestroySpace));

exports.generateCreateCommands = times(always(yabaiCreateSpace));

exports.generateFocusWindowCommand = windowId => `yabai -m window --focus ${windowId}`;
exports.generateFocusSpaceCommand = spaceIndex => `yabai -m space --focus ${spaceIndex}`;
exports.generateFocusDisplayCommand = displayNumber => `yabai -m display --focus ${displayNumber}`;
exports.generateMoveWindowToSpace = (windowId, targetSpaceIndex) => `yabai -m window ${windowId} --space ${targetSpaceIndex}`;
exports.generateInsertCommand = (windowId, direction) => `yabai -m window ${windowId} --insert ${direction}`;
exports.generateWarpCommand = (sourceId, targetId) => `yabai -m window ${sourceId} --warp ${targetId}`;
