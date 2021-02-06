const defaultTreeNode = {
  split: 'vertical',
  type: 'treeNode'
};

exports.normalizeLayoutConfig = (layoutPlan) => {
  let absoluteSpaceIndex = 0;
  return layoutPlan.flatMap((displayConfig, index) => {
    return displayConfig.map((spaceConfig) => {
      absoluteSpaceIndex += 1;

      const windows = spaceConfig.map(windowDescriptor => {
        if (typeof (windowDescriptor) === 'string') {
          return {
            type: 'window',
            app: windowDescriptor
          };
        }

        return {
          ...windowDescriptor,
          type: 'window'
        };
      });


      return {
        display: index + 1,
        index: absoluteSpaceIndex,
        windowTree: {
          ...defaultTreeNode,
          windows
        }
      };
    });

  });
};
