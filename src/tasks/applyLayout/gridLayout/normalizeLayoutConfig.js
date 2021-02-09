const { createWindowTree } = require('./createWindowTree');

exports.normalizeLayoutConfig = (layoutPlan) => {
  let absoluteSpaceIndex = 0;
  return layoutPlan.flatMap((spaces, displayIndex) => {
    return spaces.map((configuredWindows) => {
      absoluteSpaceIndex += 1;

      return {
        display: displayIndex + 1,
        index: absoluteSpaceIndex,
        windowTree: createWindowTree(configuredWindows)
      };
    });
  });
};
