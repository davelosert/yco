const { generateMoveWindowToSpace } = require('../../../shared/yabaiCommands');
const { getMostLeftWindowOf } = require('./WindowTree');


exports.moveFirstWindow = (layoutPlan) => layoutPlan.reduce((commands, currentSpace) => {
  const firstWindow = getMostLeftWindowOf(currentSpace.windowTree);

  if (firstWindow && firstWindow.space !== currentSpace.index)
    return [
      ...commands,
      generateMoveWindowToSpace(firstWindow.id, currentSpace.index)
    ];

  return commands;
}, []);
