const { generateSwapCommand } = require('../../../shared/yabaiCommands');
const { getCreationOffset } = require('../domain/LayoutPlan');
const R = require('ramda');


const getUnmanagedSpaces = layoutPlan => R.filter(space => space.unmanaged)(layoutPlan);

const swapUnmanagedSpaces = (layoutPlan) => {
  const unmanagedSpaces = getUnmanagedSpaces(layoutPlan);

  return R.reduce(
    (commands, unmanagedSpace) => {
      const sourceIndex = unmanagedSpace.swapWith + getCreationOffset(unmanagedSpace.display, layoutPlan);
      if (sourceIndex === unmanagedSpace.index) {
        return commands;
      }

      return [
        ...commands,
        generateSwapCommand(sourceIndex, unmanagedSpace.index)
      ];
    },
    []
  )(unmanagedSpaces);


};


module.exports = {
  swapUnmanagedSpaces
};
