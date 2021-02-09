const { mapWindows } = require('./WindowTree');
const R = require('ramda');




const addWindowFrom = R.curry((yabaiWindows, window) => {
  const match = yabaiWindows.find(yabaiWindow => {
    return yabaiWindow.app === window.app;
  });

  return {
    ...window,
    ...match
  };
});

const hydrateWindows = (yabaiWindows, windowTree) => {
  return mapWindows(addWindowFrom(yabaiWindows), windowTree);
};

module.exports = {
  hydrateWindows
};
