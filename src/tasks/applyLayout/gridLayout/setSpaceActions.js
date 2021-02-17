const R = require('ramda');
const { addAction, createSpacePlan } = require('./SpacePlan');

const groupByDisplay = R.pipe(
  R.groupBy(space => space.display),
  R.values
);

const context = {
  accumLayoutPlan: []
};

exports.setSpaceActions = R.curry((yabaiSpaces, layoutPlan) => {
  const layoutsByDisplay = groupByDisplay(layoutPlan);
  const yabaiSpacesByDisplay = groupByDisplay(yabaiSpaces);

  return layoutsByDisplay.reduce((currentContext, layoutPlansForCurrentDisplay, index) => {
    return {
      accumLayoutPlan: [
        ...currentContext.accumLayoutPlan,
        ...setForDisplay(yabaiSpacesByDisplay[index], layoutPlansForCurrentDisplay)
      ]
    };
  }, context).accumLayoutPlan;
});

function setForDisplay(yabaiSpaces, layoutPlan) {
  let remainingSpaces = R.clone(yabaiSpaces);
  const partialPlan = layoutPlan.map(spacePlan => {
    const existingSpace = yabaiSpaces.find(yabaiSpace => yabaiSpace.index === spacePlan.index && yabaiSpace.display === spacePlan.display);
    if (!existingSpace) {
      return addAction('create', spacePlan);
    }
    remainingSpaces = R.without([existingSpace], remainingSpaces);
    return addAction('leave', spacePlan);
  });

  if (remainingSpaces.length > 0) {
    return [
      ...partialPlan,
      ...remainingSpaces.map(R.pipe(
        createSpacePlan,
        addAction('destroy')
      ))
    ];
  }

  return partialPlan;
}
