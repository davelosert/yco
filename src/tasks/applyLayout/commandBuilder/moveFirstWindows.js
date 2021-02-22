const { generateMoveWindowToSpace } = require('../../../shared/yabaiCommands');
const { getMostLeftWindowOf } = require('../domain/WindowTree');
const { getSwapTarget, getCreationOffset } = require('../domain/LayoutPlan');

exports.moveFirstWindow = (layoutPlan) => layoutPlan.reduce((commands, currentSpace) => {
  const firstWindow = getMostLeftWindowOf(currentSpace.windowTree);

  if (!firstWindow) {
    return commands;
  }

  const indexOffset = getCreationOffset(firstWindow.display, layoutPlan);
  const spaceSwapTarget = getSwapTarget(currentSpace.index, layoutPlan);
  const compareSpace = spaceSwapTarget ? spaceSwapTarget : currentSpace.index;

  if (firstWindow.space + indexOffset !== compareSpace) {
    return [
      ...commands,
      generateMoveWindowToSpace(firstWindow.id, currentSpace.index)
    ];
  }

  return commands;
}, []);
