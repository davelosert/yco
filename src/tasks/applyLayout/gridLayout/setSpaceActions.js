const { clone, without, groupBy, pipe, values } = require('ramda');
const { addAction, createSpacePlan } = require('./SpacePlan');

const groupByDisplay = pipe(
  groupBy(space => space.display),
  values
);

const context = {
  accumLayoutPlan: []
};

exports.setSpaceActions = (yabaiSpaces, layoutPlan) => {
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
};

function setForDisplay(yabaiSpaces, layoutPlan) {
  let remainingSpaces = clone(yabaiSpaces);
  const partialPlan = layoutPlan.map(spacePlan => {
    const existingSpace = yabaiSpaces.find(yabaiSpace => yabaiSpace.index === spacePlan.index && yabaiSpace.display === spacePlan.display);
    if (!existingSpace) {
      return addAction('create', spacePlan);
    }
    remainingSpaces = without([existingSpace], remainingSpaces);
    return addAction('leave', spacePlan);
  });

  if (remainingSpaces.length > 0) {
    return [
      ...partialPlan,
      ...remainingSpaces.map(pipe(
        createSpacePlan,
        addAction('destroy')
      ))
    ];
  }

  return partialPlan;
}
