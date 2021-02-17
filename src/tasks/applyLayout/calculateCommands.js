const { normalizeLayoutConfig } = require('./gridLayout/normalizeLayoutConfig');
const { hydrateWindows } = require('./gridLayout/hydrateWindows');
const { moveFirstWindow } = require('./gridLayout/moveFirstWindows');
const { setSpaceActions } = require('./gridLayout/setSpaceActions');
const { createSpaces } = require('./gridLayout/createSpaces');

exports.calculateCommands = ({ layoutConfig, actualSpaces, actualWindows }) => {
  const normalizedSpaces = normalizeLayoutConfig(layoutConfig.spaces);


  let layoutPlan = hydrateWindows(
    normalizedSpaces,
    actualWindows
  );

  // const unmanagedWindows = getUnmanagedWindows({ hydratedWindowLayout, actualWindows });
  // const handleUnmanagedWindows = getUnmanagedStrategy(layoutConfig.nonManaged);
  // hydratedWindowLayout = handleUnmanagedWindows({
  //   desiredLayout: hydratedWindowLayout,
  //   unmanagedWindows
  // });
  layoutPlan = setSpaceActions(actualSpaces, layoutPlan);

  return [
    ...createSpaces(layoutPlan),
    ...moveFirstWindow(layoutPlan),
  ];
};
