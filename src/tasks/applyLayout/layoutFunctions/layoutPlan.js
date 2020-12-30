const { clone, complement, isNil, times } = require('ramda');

const isNotNil = complement(isNil);

exports.addEmptySpacesToDisplay = (displayNumber, newSpaceCount, layoutPlan) => {
  const clonedPlan = clone(layoutPlan);
  times(() => clonedPlan[displayNumber - 1].push([]), newSpaceCount);
  return clonedPlan;
};

exports.addDisplaysToLayout = (newDisplayCount, layoutPlan) => ([
  ...layoutPlan,
  ...times(() => [], newDisplayCount)
]);

exports.addWindowToLayout = (window, layoutPlan) => {
  const clonedPlan = clone(layoutPlan);
  clonedPlan[window.display - 1][window.space - 1].push(window);
  return clonedPlan;
};

exports.spaceExists = (spaceNumber, displayLayout) => isNotNil(displayLayout[spaceNumber - 1]);
exports.displayExists = (displayNumber, layoutPlan) => isNotNil(layoutPlan[displayNumber - 1]);

const getSpacesOfDisplay = (displayNumber, layoutPlan) => layoutPlan[displayNumber - 1];
exports.getSpacesOfDisplay = getSpacesOfDisplay;
exports.countDisplays = (layoutPlan) => layoutPlan.length;
exports.countSpacesOfDisplay = (displayNumber, layoutPlan) => getSpacesOfDisplay(displayNumber, layoutPlan).length;
