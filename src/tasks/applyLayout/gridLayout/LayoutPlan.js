const R = require('ramda');
const createLayoutPlan = (spaces = []) => spaces;

const getDestructionOffset = (display, layoutPlan) => R.pipe(
  R.filter(space => space.display < display),
  R.filter(space => space.action === 'destroy'),
  R.length
)(layoutPlan);

const getCreationOffset = (display, layoutPlan) => R.pipe(
  R.filter(space => space.display < display),
  R.filter(space => space.action === 'create'),
  R.length
)(layoutPlan);

module.exports = {
  createLayoutPlan,
  getDestructionOffset,
  getCreationOffset
};
