const createMoveWindowCommand = (windowId, targetSpaceIndex) => `yabai -m window ${windowId} --space ${targetSpaceIndex}`;
export const createWindowCommands = (desiredWindowLayout) => {
  const flattenedSpacesLayout = desiredWindowLayout.reduce((accum, spacesSetup) => [
    ...accum,
    ...spacesSetup
  ], []);

  return flattenedSpacesLayout.reduce((commands, windows, targetSpaceIndex) => {
    windows.forEach(window => {
      if(window.space !== targetSpaceIndex + 1) {
        commands.push(createMoveWindowCommand(window.id, targetSpaceIndex + 1));
      }
    });
    return commands;
  }, []);
};
