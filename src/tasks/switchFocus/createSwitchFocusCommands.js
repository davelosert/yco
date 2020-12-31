const { generateFocusSpaceCommand, generateFocusWindowCommand } = require('../../shared/yabaiCommands');
const { isEmpty } = require('ramda');

const isFocused = window => window.focused === 1;
const noOrOnlyOneFocused = matchingWindows =>
  isEmpty(matchingWindows)
  || (matchingWindows.length === 1 && isFocused(matchingWindows[0]));

const getCurrentFocusedSpace = windows => windows.find(isFocused).space;

exports.createSwitchFocusCommands = ({ actualWindows, windowToFocus }) => {
  const matchingWindows = actualWindows.filter((yabaiWindow) => yabaiWindow.app === windowToFocus.app);

  if (noOrOnlyOneFocused(matchingWindows)) {
    return [];
  }

  const result = matchingWindows.reduce((status, currentWindow) => {
    if (isFocused(currentWindow)) {
      return { ...status, focusNextMatch: true };
    }

    if (status.focusNextMatch) {
      return { focusNextMatch: false, windowToFocus: currentWindow };
    }

    return status;
  }, { focusNextMatch: true, windowToFocus: null });

  const focusedSpace = getCurrentFocusedSpace(actualWindows);
  const foundWindow = result.windowToFocus;
  if (focusedSpace === foundWindow.space) {
    return [
      generateFocusWindowCommand(foundWindow.id)
    ];
  }


  return [
    generateFocusSpaceCommand(foundWindow.space),
    generateFocusWindowCommand(foundWindow.id)
  ];
};
