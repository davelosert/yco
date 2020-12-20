import { calculateCommands } from './calculateCommands';
import { execAndParseJSONResult, executeMultipleCommands } from '../../shared/commandExecutor';
import { getAllSpaces, getAllWindows } from './layoutFunctions/yabaiComands';

export const applyLayout = async ({ layoutConfig, isDebugMode = false }) => {
  const actualSpaces = await execAndParseJSONResult(getAllSpaces());
  const actualWindows = await execAndParseJSONResult(getAllWindows());

  const commands = calculateCommands({
    layoutConfig,
    actualSpaces,
    actualWindows
  });

  if (isDebugMode) {
    console.log('The Commands: ', commands);
  } else {
    await executeMultipleCommands(commands);
  }
};
