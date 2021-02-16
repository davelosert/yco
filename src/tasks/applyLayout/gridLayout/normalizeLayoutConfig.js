const { convertToWindowTree } = require('./convertToWindowTree');
const { createSpacePlan } = require('./SpacePlan');

exports.normalizeLayoutConfig = (layoutPlan) => {
  let absoluteSpaceIndex = 0;
  return layoutPlan.flatMap((spaces, displayIndex) => {
    return spaces.map((configuredWindows) => {
      absoluteSpaceIndex += 1;

      return createSpacePlan({
        display: displayIndex + 1,
        index: absoluteSpaceIndex,
        windowTree: convertToWindowTree(configuredWindows)
      });

    });
  });
};
