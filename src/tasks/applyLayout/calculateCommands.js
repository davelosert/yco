const R = require('ramda');
const { normalizeLayoutConfig } = require('./gridLayout/normalizeLayoutConfig');
const { hydrateWindows } = require('./gridLayout/hydrateWindows');
const { moveFirstWindow } = require('./gridLayout/moveFirstWindows');
const { setSpaceActions } = require('./gridLayout/setSpaceActions');
const { createSpaces } = require('./gridLayout/createSpaces');
const { buildWindowTreeCommands } = require('./gridLayout/buildWindowTreeCommands');

exports.calculateCommands = ({ layoutConfig, actualSpaces, actualWindows }) => {
  const layoutPlan = R.pipe(
    normalizeLayoutConfig,
    hydrateWindows(actualWindows),
    setSpaceActions(actualSpaces),
  )(layoutConfig.spaces);

  // const unmanagedWindows = getUnmanagedWindows({ hydratedWindowLayout, actualWindows });
  // const handleUnmanagedWindows = getUnmanagedStrategy(layoutConfig.nonManaged);
  // hydratedWindowLayout = handleUnmanagedWindows({
  //   desiredLayout: hydratedWindowLayout,
  //   unmanagedWindows
  // });
  const treeComands = layoutPlan.flatMap(spacePlan => buildWindowTreeCommands(spacePlan.windowTree));

  return [
    ...createSpaces(layoutPlan),
    ...moveFirstWindow(layoutPlan),
    ...treeComands
  ];
};
