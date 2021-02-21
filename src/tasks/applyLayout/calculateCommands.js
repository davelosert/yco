const R = require('ramda');
const { normalizeLayoutConfig } = require('./gridLayout/normalizeLayoutConfig');
const { moveFirstWindow } = require('./gridLayout/moveFirstWindows');
const { setSpaceActions } = require('./gridLayout/setSpaceActions');
const { createSpaces } = require('./gridLayout/createSpaces');
const { buildWindowTreeCommands } = require('./gridLayout/buildWindowTreeCommands');
const { destroySpaces } = require('./gridLayout/destroySpaces');
const { insertWindowsWith } = require('./gridLayout/insertWindowsWith');
const { getUnmanagedStrategy } = require('./gridLayout/unmanagedStrategies/getUnmanagedStrategy');
const { swapUnmanagedSpaces } = require('./gridLayout/swapUnmanagedSpaces');

exports.calculateCommands = ({ layoutConfig, actualSpaces, actualWindows }) => {
  const layoutPlan = R.pipe(
    normalizeLayoutConfig,
    insertWindowsWith(
      getUnmanagedStrategy(layoutConfig.nonManaged),
      actualWindows
    ),
    setSpaceActions(actualSpaces),
  )(layoutConfig.spaces);

  const treeComands = layoutPlan.flatMap(spacePlan => buildWindowTreeCommands(spacePlan.windowTree));

  return [
    ...createSpaces(layoutPlan),
    ...swapUnmanagedSpaces(layoutPlan),
    ...moveFirstWindow(layoutPlan),
    ...treeComands,
    ...destroySpaces(layoutPlan)
  ];
};
