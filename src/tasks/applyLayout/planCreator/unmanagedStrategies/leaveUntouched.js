const { addSpacesToDisplay } = require('../../domain/LayoutPlan');
const { createSpacePlan } = require('../../domain/SpacePlan');
const R = require('ramda');

const groupBySpace = R.groupBy(R.prop('space'));
const addSpacesTo = (layoutPlan, spaces) => addSpacesToDisplay(spaces.display, [spaces], layoutPlan);
const leaveUntouched = (unmanagedWindows, layoutPlan) => {
  if (unmanagedWindows.length === 0) {
    return layoutPlan;
  }

  return R.pipe(
    groupBySpace,
    R.mapObjIndexed((windows, spaceIndex) => {
      return createSpacePlan({
        display: windows[0].display,
        unmanagedWindows: windows,
        swapWith: Number.parseFloat(spaceIndex)
      });
    }),
    R.values,
    R.reduce(addSpacesTo, layoutPlan)
  )(unmanagedWindows);
};

module.exports = {
  leaveUntouched
};
