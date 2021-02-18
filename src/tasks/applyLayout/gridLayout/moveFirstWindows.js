const { generateMoveWindowToSpace } = require('../../../shared/yabaiCommands');
const { getCreationOffset } = require('./LayoutPlan');
const { getMostLeftWindowOf } = require('./WindowTree');


exports.moveFirstWindow = (layoutPlan) => layoutPlan.reduce((commands, currentSpace) => {
  const firstWindow = getMostLeftWindowOf(currentSpace.windowTree);

  if (!firstWindow) {
    return commands;
  }

  const indexOffset = getCreationOffset(firstWindow.display, layoutPlan);
  if (firstWindow.space + indexOffset !== currentSpace.index)
    return [
      ...commands,
      generateMoveWindowToSpace(firstWindow.id, currentSpace.index)
    ];

  return commands;
}, []);
