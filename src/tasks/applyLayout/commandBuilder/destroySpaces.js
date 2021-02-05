const { generateDestroySpace } = require('../../../shared/yabaiCommands');
const R = require('ramda');


const filterSpacesToDestroy = R.filter(space => space.action === 'destroy');
const sortDescendingByIndex = R.sortWith([R.descend(R.prop('index'))]);
const generateDestroyCommands = R.map(space => generateDestroySpace(space.index));

const destroySpaces = (layoutPlan) => {
  return R.pipe(
    filterSpacesToDestroy,
    sortDescendingByIndex,
    generateDestroyCommands
  )(layoutPlan);
};

module.exports = {
  destroySpaces
};
