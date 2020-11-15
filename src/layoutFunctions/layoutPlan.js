import { clone, complement, isNil, times } from 'ramda';

const isNotNil = complement(isNil);

export const addEmptySpacesToDisplay = (displayNumber, newSpaceCount, layoutPlan) => {
  const clonedPlan = clone(layoutPlan);
  times(() => clonedPlan[displayNumber - 1].push([]), newSpaceCount);
  return clonedPlan;
};

export const addDisplaysToLayout = (newDisplayCount, layoutPlan) => ([
  ...layoutPlan,
  ...times(() => [], newDisplayCount)
]);

export const addWindowToLayout = (window, layoutPlan) => {
  const clonedPlan = clone(layoutPlan);
  clonedPlan[window.display - 1][window.space - 1].push(window);
  return clonedPlan;
}; 

export const spaceExists = (spaceNumber, displayLayout) => isNotNil(displayLayout[spaceNumber - 1]);
export const displayExists = (displayNumber, layoutPlan) => isNotNil(layoutPlan[displayNumber - 1]);

export const getSpacesOfDisplay = (displayNumber, layoutPlan) => layoutPlan[displayNumber - 1];
export const countDisplays = (layoutPlan) => layoutPlan.length;
export const countSpacesOfDisplay = (displayNumber, layoutPlan) => getSpacesOfDisplay(displayNumber, layoutPlan).length;
