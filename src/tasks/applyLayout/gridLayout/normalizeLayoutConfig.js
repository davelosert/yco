const defaultTreeNode = {
  split: 'vertical',
  type: 'treeNode'
};

exports.normalizeLayoutConfig = (layoutPlan) => {
  let absoluteSpaceIndex = 0;
  return layoutPlan.flatMap((spaces, displayIndex) => {
    return spaces.map((configuredWindows) => {
      absoluteSpaceIndex += 1;

      const windows = normalizeWindowObjects(configuredWindows);

      return {
        display: displayIndex + 1,
        index: absoluteSpaceIndex,
        windowTree: {
          ...defaultTreeNode,
          windows
        }
      };
    });
  });
};


function normalizeWindowObjects(windowObjects) {
  return windowObjects.map(windowDescriptor => {
    if (typeof (windowDescriptor) === 'string') {
      return {
        type: 'window',
        app: windowDescriptor
      };
    }

    if (isPlaneDescriptor(windowDescriptor)) {
      return {
        ...windowDescriptor,
        type: 'treeNode',
        windows: normalizeWindowObjects(windowDescriptor.windows)
      };
    }


    return {
      ...windowDescriptor,
      type: 'window'
    };
  });
}

function isPlaneDescriptor(windowObject) {
  return Boolean(windowObject.split);
}
