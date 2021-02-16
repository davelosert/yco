const { createWindowTree } = require('./WindowTree');
const R = require('ramda');

const createSpacePlan = ({ display, index, windowTree = createWindowTree() }) => ({
  display,
  index,
  windowTree
});

const addAction = R.curry((action, spacePlan) => ({ ...spacePlan, action }));

module.exports = {
  addAction,
  createSpacePlan
};
