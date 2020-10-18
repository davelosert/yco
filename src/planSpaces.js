import { pipe, groupBy, values } from 'ramda';

const groupByDisplay = pipe(
  groupBy(space => space.display),
  values
)

const lastDisplayWouldBeDeleted = (currentSpaces, desiredSpaces) => currentSpaces.length === 1 && desiredSpaces.length === 0;

export const planSpaces = ({ currentSpaces, desiredSpaces }) => {
  return groupByDisplay(currentSpaces).map((spaces, displayIndex) => {
    const desiredSpacesForDisplay = desiredSpaces[displayIndex];
    if (lastDisplayWouldBeDeleted(spaces, desiredSpacesForDisplay)) {
      return 0;
    }

    return desiredSpacesForDisplay.length - spaces.length;
  })
}
