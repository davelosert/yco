const R = require('ramda');
const { mapWindows } = require('./WindowTree');

exports.hydrateWindows = R.curry((layoutPlan, yabaiWindows) => {
  let remainingWindows = R.clone(yabaiWindows);
  return layoutPlan
    .map(spacePlan => {
      return {
        ...spacePlan,
        windowTree: mapWindows(windowDescriptor => {
          const matchingWindow = remainingWindows.find(window => windowDescriptor.app === window.app);
          remainingWindows = R.without([matchingWindow], yabaiWindows);

          return {
            ...windowDescriptor,
            ...matchingWindow
          };

        })(spacePlan.windowTree)
      };
    });
});
