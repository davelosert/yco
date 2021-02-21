const { createWindowTree } = require('./WindowTree');
const R = require('ramda');

const createSpacePlan = ({ display = 0, index = 0, windowTree = createWindowTree(), action, unmanagedWindows, swapWith }) => {
  let baseSpace = {
    display,
    index,
    windowTree
  };

  if (action) {
    baseSpace = addAction(action, baseSpace);
  }

  if (unmanagedWindows) {
    baseSpace = {
      ...baseSpace,
      unmanaged: true,
      unmanagedWindows,
    };
  }

  if (swapWith) {
    baseSpace = {
      ...baseSpace,
      swapWith
    };
  }

  return baseSpace;
};

const addAction = R.curry((action, spacePlan) => ({ ...spacePlan, action }));
const addIndexOffset = R.curry((offset, spacePlan) => {
  let mutatedSpace = { ...spacePlan, index: spacePlan.index + offset };

  if (mutatedSpace.swapWith) {
    mutatedSpace = {
      ...mutatedSpace,
      swapWith: mutatedSpace.swapWith + offset
    };

  }
  return mutatedSpace;
});
const setIndex = R.curry((index, spacePlan) => ({ ...spacePlan, index }));


module.exports = {
  addAction,
  addIndexOffset,
  setIndex,
  createSpacePlan
};
