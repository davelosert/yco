const { buildWindowTrees } = require('./commandBuilder/buildWindowTrees');
const { createSpaces } = require('./commandBuilder/createSpaces');
const { destroySpaces } = require('./commandBuilder/destroySpaces');
const { getUnmanagedStrategy } = require('./planCreator/unmanagedStrategies/getUnmanagedStrategy');
const { insertWindowsWith } = require('./planCreator/insertWindowsWith');
const { moveFirstWindow } = require('./commandBuilder/moveFirstWindows');
const { normalizeLayoutConfig } = require('./configConverter/normalizeLayoutConfig');
const { setSpaceActions } = require('./planCreator/setSpaceActions');
const { swapUnmanagedSpaces } = require('./commandBuilder/swapUnmanagedSpaces');
const R = require('ramda');

exports.calculateCommands = ({ layoutConfig, actualSpaces, actualWindows }) => {
  const layoutPlan = R.pipe(
    normalizeLayoutConfig,
    insertWindowsWith(
      getUnmanagedStrategy(layoutConfig.nonManaged),
      actualWindows
    ),
    setSpaceActions(actualSpaces),
  )(layoutConfig.spaces);

  return [
    ...createSpaces(layoutPlan),
    ...swapUnmanagedSpaces(layoutPlan),
    ...moveFirstWindow(layoutPlan),
    ...buildWindowTrees(layoutPlan),
    ...destroySpaces(layoutPlan)
  ];
};
