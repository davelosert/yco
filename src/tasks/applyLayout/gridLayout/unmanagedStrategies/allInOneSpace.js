const { getHighestIndexForDisplay } = require('../LayoutPlan');
const { createWindowTree } = require('../WindowTree');
const { createSpacePlan } = require('../SpacePlan');
const { addSpacesToDisplay } = require('../LayoutPlan');

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
