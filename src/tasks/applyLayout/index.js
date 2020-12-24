import { calculateCommands } from './calculateCommands';
import { allSpaces, allWindows } from '../../shared/yabaiComands';

export const applyLayout = async ({ layoutConfig, yabaiAdapter }) => {
  const actualSpaces = await yabaiAdapter.query(allSpaces());
  const actualWindows = await yabaiAdapter.query(allWindows());

  const commands = calculateCommands({
    layoutConfig,
    actualSpaces,
    actualWindows
  });

  await yabaiAdapter.apply(commands);
};
