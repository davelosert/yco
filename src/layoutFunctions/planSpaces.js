import { always, isNil, groupBy,  pipe , values,  } from 'ramda';

const groupByDisplay = pipe(
  groupBy(space => space.display),
  values
);

const lastDisplayWouldBeDeleted = (desiredSpaces, currentSpaces) => currentSpaces.length === 1 && desiredSpaces.length === 0;
const removeAllButOne = spaces => 1 - spaces.length;
const removeNoSpaces = always(0);
const addOrRemoveDifference = (desiredSpacesForDisplay, spaces) => desiredSpacesForDisplay.length - spaces.length;

export const planSpaces = ({ currentSpaces, desiredSpaces }) => {
  return groupByDisplay(currentSpaces).map((spacesOfDisplay, displayIndex) => {
    const desiredSpacesForDisplay = desiredSpaces[displayIndex];
    if(isNil(desiredSpacesForDisplay)) {
      return removeAllButOne(spacesOfDisplay);
    }

    if (lastDisplayWouldBeDeleted(desiredSpacesForDisplay, spacesOfDisplay)) {
      return removeNoSpaces();
    }

    return addOrRemoveDifference(desiredSpacesForDisplay, spacesOfDisplay);
  });
};

export const countSpacesPerDisplay = (currentSpaces) => (
  groupByDisplay(currentSpaces).map(spaces => spaces.length)
);
