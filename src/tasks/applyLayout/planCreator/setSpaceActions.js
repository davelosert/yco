const R = require('ramda');
const { addAction, addIndexOffset, createSpacePlan } = require('../domain/SpacePlan');
const { getDestructionOffset, getCreationOffset } = require('../domain/LayoutPlan');

const groupByDisplay = R.pipe(
  R.groupBy(space => space.display),
  R.values
);


exports.setSpaceActions = R.curry((yabaiSpaces, layoutPlan) => {
  const spacesByDisplay = groupByDisplay(layoutPlan);
  const yabaiSpacesByDisplay = groupByDisplay(yabaiSpaces);

  return spacesByDisplay.reduce((currentContext, spaces, index) => {
    // When there are more spaces in yabai than within the plan (so spaces that need to be destroyed), the previously absolute indices of the plan are wrong.
    // This is because lefotver spaces will only be destroyed in the end. 
    const planOffset = getDestructionOffset(index + 1, currentContext);

    // On the contrary, if there are more spaces planned than available in yabai, we have to raise the yabaiIndex
    // so that when issuing a destroy-statement, the correct index will be set
    const yabaiOffset = getCreationOffset(index + 1, currentContext);

    return [
      ...currentContext,
      ...addActions(yabaiSpacesByDisplay[index], spaces, planOffset, yabaiOffset)
    ];
  }, []);

});


const moreYabaiSpacesExistThanPlanned = diff => diff < 0;
const lessYabaiSpacesExistThanPlanned = diff => diff > 0;

function addActions(yabaiSpaces, spacePlans, planOffset, yabaiOffset) {
  const diff = spacePlans.length - yabaiSpaces.length;

  const spacesToLeave = R.pipe(
    R.take(spacePlans.length - diff),
    R.map(R.pipe(
      addAction('leave'),
      addIndexOffset(planOffset)
    ))
  )(spacePlans);

  if (moreYabaiSpacesExistThanPlanned(diff)) {
    return [
      ...spacesToLeave,
      ...R.pipe(
        R.takeLast(diff * -1),
        R.map(R.pipe(
          createSpacePlan,
          addAction('destroy'),
          addIndexOffset(yabaiOffset)
        ))
      )(yabaiSpaces)
    ];
  }

  if (lessYabaiSpacesExistThanPlanned(diff)) {
    return [
      ...spacesToLeave,
      ...R.pipe(
        R.takeLast(diff),
        R.map(R.pipe(
          addAction('create'),
          addIndexOffset(planOffset)
        ))
      )(spacePlans)
    ];
  }

  return spacesToLeave;


}
