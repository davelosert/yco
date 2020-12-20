import { createSpaceCommands } from './layoutFunctions/createSpaceCommands';
import { createWindowCommands } from './layoutFunctions/createWindowCommands';
import { getUnmanagedStrategy } from './layoutFunctions/planUnmanagedWindows';
import { getUnmanagedWindows, hydrateWindowLayout } from './layoutFunctions/hydrateWindowLayout';
import { countSpacesPerDisplay, planSpaces } from './layoutFunctions/planSpaces';

export const calculateCommands = ({ layoutConfig, actualSpaces, actualWindows }) => {
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
    ...createWindowCommands(hydratedWindowLayout)
  ];
};
