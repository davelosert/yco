const { adjust, complement, map } = require('ramda');
const { addDisplaysToLayout, addEmptySpacesToDisplay, addWindowToLayout, countDisplays, countSpacesOfDisplay, displayExists, getSpacesOfDisplay, spaceExists } = require('./layoutPlan');

const allInOneSpace = ({ desiredLayout, unmanagedWindows }) => {
  if (unmanagedWindows.length === 0) {
    return desiredLayout;
  }
  return adjust(0, (spacesOfDisplay) => [
    ...spacesOfDisplay,
    unmanagedWindows
  ])(desiredLayout);
};

const wrapEachInArray = map(val => [val]);
const allInOwnSpace = ({ desiredLayout, unmanagedWindows }) => {
  if (unmanagedWindows.length === 0) {
    return desiredLayout;
  }
  return adjust(0, (spacesOfDisplay) => [
    ...spacesOfDisplay,
    ...wrapEachInArray(unmanagedWindows)
  ])(desiredLayout);
};


const spaceIsMissing = complement(spaceExists);
const displayIsMissing = complement(displayExists);
const leaveUntouched = ({ desiredLayout, unmanagedWindows }) => {
  if (unmanagedWindows.length === 0) {
    return desiredLayout;
  }

  unmanagedWindows.forEach(window => {
    if (displayIsMissing(window.display, desiredLayout)) {
      const missingDisplayCount = window.display - countDisplays(desiredLayout);
      desiredLayout = addDisplaysToLayout(missingDisplayCount, desiredLayout);
    }

    const spaces = getSpacesOfDisplay(window.display, desiredLayout);

    if (spaceIsMissing(window.space, spaces)) {
      const missingSpaceCount = window.space - countSpacesOfDisplay(window.display, desiredLayout);
      desiredLayout = addEmptySpacesToDisplay(window.display, missingSpaceCount, desiredLayout);
    }

    desiredLayout = addWindowToLayout(window, desiredLayout);
  });

  return desiredLayout;
};

const strategies = {
  allInOneSpace,
  allInOwnSpace,
  leaveUntouched
};

exports.getUnmanagedStrategy = (strategyId) => strategies[strategyId];
