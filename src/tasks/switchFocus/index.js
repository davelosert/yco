const { allWindows, allSpaces } = require('../../shared/yabaiCommands');
const { createSwitchFocusCommands } = require('./createSwitchFocusCommands');

exports.switchFocus = async ({ yabaiAdapter, windowQuery }) => {
  const actualWindows = await yabaiAdapter.query(allWindows());
  const actualSpaces = await yabaiAdapter.query(allSpaces());

  const focusCommands = createSwitchFocusCommands({ actualWindows, actualSpaces, windowToFocus: windowQuery });

  await yabaiAdapter.apply(focusCommands);
};
