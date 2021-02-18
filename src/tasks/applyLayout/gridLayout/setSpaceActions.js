const R = require('ramda');
const { addIndexOffset } = require('./SpacePlan');
const { addAction, createSpacePlan } = require('./SpacePlan');

const groupByDisplay = R.pipe(
  R.groupBy(space => space.display),
  R.values
);

const context = {
  indexOffset: 0,
  yabaiOffset: 0,
  layoutPlan: []
};

exports.setSpaceActions = R.curry((yabaiSpaces, layoutPlan) => {
  const spacesByDisplay = groupByDisplay(layoutPlan);
  const yabaiSpacesByDisplay = groupByDisplay(yabaiSpaces);

  let newLayout = spacesByDisplay.reduce((currentContext, spaces, index) => {
    const actionized = addActions(yabaiSpacesByDisplay[index], spaces, currentContext.indexOffset, currentContext.yabaiOffset);

    // When there are more spaces in yabai than within the plan (so spaces that need to be destroyed), the previously absolute indices of the plan are wrong.
    // This is because lefotver spaces will only be destroyed in the end. 
    const indexOffset = actionized.filter(space => space.action === 'destroy').length;
    const yabaiOffset = actionized.filter(space => space.action === 'create').length;
    return {
      layoutPlan: [
        ...currentContext.layoutPlan,
        ...actionized
      ],
      indexOffset: currentContext.indexOffset + indexOffset,
      yabaiOffset: currentContext.yabaiOffset + yabaiOffset
    };
  }, context).layoutPlan;

  return newLayout;
});


const moreYabaiSpacesExistThanPlanned = diff => diff < 0;
const lessYabaiSpacesExistThanPlanned = diff => diff > 0;

function addActions(yabaiSpaces, spacePlans, indexOffset, yabaiOffset) {
  const diff = spacePlans.length - yabaiSpaces.length;

  const spacesToLeave = R.pipe(
    R.take(spacePlans.length - diff),
    R.map(R.pipe(
      addAction('leave'),
      addIndexOffset(indexOffset)
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
          addIndexOffset(indexOffset)
        ))
      )(spacePlans)
    ];
  }

  return spacesToLeave;


}
