import { addIndex, pipe, reduce, unnest } from 'ramda';

const reduceIndexed = addIndex(reduce);
const createMoveWindowCommand = (windowId, targetSpaceIndex) => `yabai -m window ${windowId} --space ${targetSpaceIndex}`;

export const createWindowCommands = (desiredWindowLayout) => pipe(
  unnest,
  reduceIndexed((commands, windows, targetSpaceIndex) => {
      windows.forEach(window => {
        if(window.space !== targetSpaceIndex + 1) {
          commands.push(createMoveWindowCommand(window.id, targetSpaceIndex + 1));
        }
      });
      return commands;
    }, [])
)(desiredWindowLayout);
