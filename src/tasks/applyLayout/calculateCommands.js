const { createSpaceCommands } = require('./layoutFunctions/createSpaceCommands');
const { createWindowCommands } = require('./layoutFunctions/createWindowCommands');
const { getUnmanagedStrategy } = require('./layoutFunctions/planUnmanagedWindows');
const { getUnmanagedWindows, hydrateWindowLayout } = require('./layoutFunctions/hydrateWindowLayout');
const { countSpacesPerDisplay, planSpaces } = require('./layoutFunctions/planSpaces');

exports.calculateCommands = ({ layoutConfig, actualSpaces, actualWindows }) => {
  let hydratedWindowLayout = hydrateWindowLayout({
    actualWindows,
    plannedWindowSetup: layoutConfig.spaces
  });

  const unmanagedWindows = getUnmanagedWindows({ hydratedWindowLayout, actualWindows });
  const handleUnmanagedWindows = getUnmanagedStrategy(layoutConfig.nonManaged);
  hydratedWindowLayout = handleUnmanagedWindows({
    desiredLayout: hydratedWindowLayout,
    unmanagedWindows
  });

  const spacesPlan = planSpaces({ actualSpaces, desiredSpaces: hydratedWindowLayout });
  const spacesCount = countSpacesPerDisplay(actualSpaces);

  return [
    ...createSpaceCommands({ spacesPlan, spacesCount }),
    ...createWindowCommands({ desiredWindowLayout: hydratedWindowLayout, spacesPlan })
  ];
};
