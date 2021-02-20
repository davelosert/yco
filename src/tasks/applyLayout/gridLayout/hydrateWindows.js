const R = require('ramda');
const { mapWindows } = require('./WindowTree');

exports.hydrateWindows = R.curry((yabaiWindows, layoutPlan) => {
  let remainingWindows = R.clone(yabaiWindows);
  const hydratedPLan = layoutPlan
    .map(spacePlan => {
      return {
        ...spacePlan,
        windowTree: mapWindows(windowDescriptor => {
          const matchingWindow = remainingWindows.find(window => windowDescriptor.app === window.app);
          remainingWindows = R.without([matchingWindow], remainingWindows);

          return {
            ...windowDescriptor,
            ...matchingWindow
          };

        })(spacePlan.windowTree)
      };
    });

  return {
    layoutPlan: hydratedPLan,
    remainingWindows
  };
});
