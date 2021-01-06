const { generateFocusSpaceCommand, generateFocusWindowCommand } = require('../../shared/yabaiCommands');
const { isEmpty } = require('ramda');

const isFocused = window => window.focused === 1;
const byId = (windowA, windowB) => {
  if (windowA.id < windowB.id) return -1;
  if (windowA.id > windowB.id) return 1;
  if (windowA.id === windowB.id) return 0;
};

const noOrOnlyOneFocused = matchingWindows =>
  isEmpty(matchingWindows)
  || (matchingWindows.length === 1 && isFocused(matchingWindows[0]));

const getCurrentFocusedSpace = spaces => spaces.find(isFocused).index;

exports.createSwitchFocusCommands = ({ actualWindows, actualSpaces, windowToFocus }) => {
  const matchingWindows = actualWindows.filter((yabaiWindow) => yabaiWindow.app === windowToFocus.app);

  if (noOrOnlyOneFocused(matchingWindows)) {
    return [];
  }

  const result = matchingWindows
    .sort(byId)
    .reduce((status, currentWindow) => {
      if (isFocused(currentWindow)) {
        return { ...status, focusNextMatch: true };
      }

      if (status.focusNextMatch) {
        return { focusNextMatch: false, windowToFocus: currentWindow };
      }

      return status;
    }, { focusNextMatch: true, windowToFocus: null });

  const focusedSpace = getCurrentFocusedSpace(actualSpaces);
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
