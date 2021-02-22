const { buildWindowTreeCommands } = require('./buildWindowTreeCommands');
const buildWindowTrees = (layoutPlan) => {
  const treeComands = layoutPlan.flatMap(spacePlan => buildWindowTreeCommands(spacePlan.windowTree));
  return treeComands;
};

module.exports = {
  buildWindowTrees
};
