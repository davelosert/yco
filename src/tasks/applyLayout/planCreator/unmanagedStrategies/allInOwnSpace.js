const { addSpacesToDisplay } = require('../../domain/LayoutPlan');
const { createSpacePlan } = require('../../domain/SpacePlan');
const { createWindowTree } = require('../../domain/WindowTree');

const allInOwnSpace = (unmanagedWindows, layoutPlan) => {
  if (unmanagedWindows.length === 0) {
    return layoutPlan;
  }

  const unmanagedSpaces = unmanagedWindows.map(window => createSpacePlan({
    windowTree: createWindowTree({
      windows: [({
        ...window,
        type: 'window'
      })]
    })
  }));

  return addSpacesToDisplay(1, unmanagedSpaces, layoutPlan);
};

module.exports = {
  allInOwnSpace
};
