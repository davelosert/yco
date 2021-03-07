const { calculateCommands } = require('./calculateCommands');
const { allSpaces, allWindows } = require('../../shared/yabaiCommands');
const { openMissingWindows } = require('./openMissingWindows');

exports.applyLayout = async ({ layoutConfig, yabaiAdapter, generalConfigs }) => {
  await openMissingWindows(yabaiAdapter, layoutConfig, generalConfigs);

  const actualSpaces = await yabaiAdapter.query(allSpaces());
  const actualWindows = await yabaiAdapter.query(allWindows());
  const commands = calculateCommands({
    layoutConfig,
    actualSpaces,
    actualWindows
  });

  await yabaiAdapter.apply(commands);
};
