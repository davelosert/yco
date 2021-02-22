const { addSpacesToDisplay } = require('../../domain/LayoutPlan');
const { createSpacePlan } = require('../../domain/SpacePlan');
const { createWindowTree } = require('../../domain/WindowTree');

const allInOneSpace = (unmanagedWindows, layoutPlan) => {
  if (unmanagedWindows.length === 0) {
    return layoutPlan;
  }

  const unmanagedSpace = createSpacePlan({
    windowTree: createWindowTree({
      windows: unmanagedWindows.map(window => ({
        ...window,
        type: 'window'
      }))
    })
  });

  return addSpacesToDisplay(1, [unmanagedSpace], layoutPlan);
};

module.exports = {
  allInOneSpace
};
