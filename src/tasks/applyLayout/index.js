const { calculateCommands } = require('./calculateCommands');
const { allSpaces, allWindows } = require('../../shared/yabaiCommands');
const { openMissingWindows } = require('./openMissingWindows');
const { filterIgnoredWindows } = require('./yabaiHelper/filterIgnoredWindows');

exports.applyLayout = async ({ layoutConfig, yabaiAdapter, generalConfigs }) => {
  await openMissingWindows(yabaiAdapter, layoutConfig, generalConfigs);

  const actualSpaces = await yabaiAdapter.query(allSpaces());
  const actualWindows = await yabaiAdapter.query(allWindows());
  const commands = calculateCommands({
    layoutConfig,
    actualSpaces,
    actualWindows: filterIgnoredWindows(actualWindows, generalConfigs.layoutModeIgnoreWindows)
  });

  await yabaiAdapter.apply(commands);
};
