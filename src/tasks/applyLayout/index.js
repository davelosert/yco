const { calculateCommands } = require('./calculateCommands');
const { allSpaces, allWindows } = require('../../shared/yabaiComands');

exports.applyLayout = async ({ layoutConfig, yabaiAdapter }) => {
  const actualSpaces = await yabaiAdapter.query(allSpaces());
  const actualWindows = await yabaiAdapter.query(allWindows());

  const commands = calculateCommands({
    layoutConfig,
    actualSpaces,
    actualWindows
  });

  await yabaiAdapter.apply(commands);
};
