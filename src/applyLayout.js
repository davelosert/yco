import { execAndParseJSONResult, executMultipleCommands } from './commandExecutor';
import { getUnmanagedWindows, hydrateWindowLayout } from './layoutFunctions/hydrateWindowLayout';
import { countSpacesPerDisplay, planSpaces } from './layoutFunctions/planSpaces';
import { createSpaceCommands } from './layoutFunctions/createSpaceCommands';
import { createWindowCommands } from './layoutFunctions/createWindowCommands';
import { getAllSpaces, getAllWindows } from './layoutFunctions/yabaiComands';
import { getUnmanagedStrategy } from './layoutFunctions/planUnmanagedWindows';

const config = require('../exampleConfig.json');

export const applyWindowLayout = async (desiredLayout, debug) => {
  const actualSpaces = await execAndParseJSONResult(getAllSpaces());
  const actualWindows = await execAndParseJSONResult(getAllWindows());

  let hydratedWindowLayout = hydrateWindowLayout({
    actualWindows,
    plannedWindowSetup: desiredLayout.spaces
  });

  const unmanagedWindows = getUnmanagedWindows({ hydratedWindowLayout, actualWindows });
  const handleUnmanagedWindows = getUnmanagedStrategy(desiredLayout.nonManaged);
  hydratedWindowLayout = handleUnmanagedWindows({ 
    desiredLayout: hydratedWindowLayout,
    unmanagedWindows
  });

  const spacesPlan = planSpaces({ actualSpaces, desiredSpaces: hydratedWindowLayout });
  const spacesCount = countSpacesPerDisplay(actualSpaces);

  const commands = [
    ...createSpaceCommands({ spacesPlan, spacesCount }),
    ...createWindowCommands(hydratedWindowLayout)
  ];

  if(debug) {
    console.log('The Plan:', hydratedWindowLayout);
    console.log('The Commands: ', commands);
  } 
  await executMultipleCommands(commands);
};

(async function start() {
  const layout = process.argv[2] || 'monitor';
  const debug = process.argv[3] === '--debug' ; 
  console.log('Applying layout:', layout);
  await applyWindowLayout(config.layouts[layout], debug);
})();
