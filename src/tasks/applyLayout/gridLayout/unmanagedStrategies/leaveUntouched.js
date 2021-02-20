const R = require('ramda');
const { addSpacesToDisplay } = require('../LayoutPlan');
const { createSpacePlan } = require('../SpacePlan');

const groupByIndex = R.groupBy(R.prop('index'));
const addSpacesTo = (layoutPlan, spaces) => addSpacesToDisplay(spaces.display, [spaces], layoutPlan);
const leaveUntouched = (unmanagedWindows, layoutPlan) => {
  if (unmanagedWindows.length === 0) {
    return layoutPlan;
  }

  return R.pipe(
    groupByIndex,
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
