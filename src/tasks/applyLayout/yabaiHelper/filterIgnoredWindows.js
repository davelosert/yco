const R = require('ramda');


const matchesConfigInIgnoreList = R.curry((ignoreList, yabaiWindow) => ignoreList.find(ignoredWindowConfig => {
  const appNameMatch = yabaiWindow.app === ignoredWindowConfig.app;

  if (ignoredWindowConfig.title) {
    return appNameMatch && yabaiWindow.title === ignoredWindowConfig.title;
  }

  return appNameMatch;
}
));

const filterIgnoredWindows = (yabaiWindows, ignoredWindowConfigs) => {
  return R.reject(matchesConfigInIgnoreList(ignoredWindowConfigs), yabaiWindows);
};

module.exports = {
  filterIgnoredWindows
};
