const { convertToWindowTree } = require('./convertToWindowTree');
const { createSpacePlan } = require('../domain/SpacePlan');

exports.normalizeLayoutConfig = (layoutConfig) => {
  let absoluteSpaceIndex = 0;
  return layoutConfig.flatMap((spaces, displayIndex) => {
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
