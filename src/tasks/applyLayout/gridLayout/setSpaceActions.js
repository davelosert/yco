const { clone, without, pipe } = require('ramda');
const { addAction, createSpacePlan } = require('./SpacePlan');

exports.setSpaceActions = (yabaiSpaces, layoutPlan) => {
  let remainingSpaces = clone(yabaiSpaces);

  const partialPlan = layoutPlan.map(spacePlan => {
    const existingSpace = yabaiSpaces.find(yabaiSpace => yabaiSpace.index === spacePlan.index);
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

};
