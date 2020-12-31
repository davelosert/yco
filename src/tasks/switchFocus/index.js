const { allWindows } = require('../../shared/yabaiCommands');
const { createSwitchFocusCommands } = require('./createSwitchFocusCommands');

exports.switchFocus = async ({ yabaiAdapter, windowQuery }) => {
  const actualWindows = await yabaiAdapter.query(allWindows());

  const focusCommands = createSwitchFocusCommands({ actualWindows, windowToFocus: windowQuery });

  await yabaiAdapter.apply(focusCommands);
};
