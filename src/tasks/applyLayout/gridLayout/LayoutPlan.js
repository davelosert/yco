const R = require('ramda');
const { addIndexOffset } = require('./SpacePlan');
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

const getHighestIndexForDisplay = (display, layoutPlan) =>
  R.defaultTo(
    layoutPlan.length,
    R.pipe(
      R.filter(space => space.display === display),
      R.last,
      R.prop('index')
    )(layoutPlan));


const raiseIndexForDisplaysAfter = R.curry((display, offset, layoutPlan) => R.map(space => {
  if (space.display > display) {
    return addIndexOffset(offset, space);
  }
  return space;
})(layoutPlan));

const addSpacesToDisplay = R.curry((display, spaces, layoutPlan) => {
  const startIndex = getHighestIndexForDisplay(display, layoutPlan);
  const insertSpaces = spaces.map((space, currentIndex) => {
    return {
      ...space,
      display,
      index: startIndex + currentIndex + 1
    };
  });

  const insertedLayout = R.insertAll(startIndex, insertSpaces, layoutPlan);

  return raiseIndexForDisplaysAfter(display, spaces.length, insertedLayout);
});

module.exports = {
  addSpacesToDisplay,
  createLayoutPlan,
  getDestructionOffset,
  getCreationOffset,
  getHighestIndexForDisplay
};
