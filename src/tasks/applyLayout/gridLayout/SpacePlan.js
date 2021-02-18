const { createWindowTree } = require('./WindowTree');
const R = require('ramda');

const createSpacePlan = ({ display, index, windowTree = createWindowTree(), action }) => {
  let baseSpace = {
    display,
    index,
    windowTree,
  };

  if (action) {
    baseSpace = addAction(action, baseSpace);
  }
  return baseSpace;
};

const addAction = R.curry((action, spacePlan) => ({ ...spacePlan, action }));
const addIndexOffset = R.curry((offset, spacePlan) => ({ ...spacePlan, index: spacePlan.index + offset }));
const setIndex = R.curry((index, spacePlan) => ({ ...spacePlan, index }));

module.exports = {
  addAction,
  addIndexOffset,
  setIndex,
  createSpacePlan
};
