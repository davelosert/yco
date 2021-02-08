const R = require('ramda');


const normalizeWindowObjects = R.map(windowDescriptor => {
  if (isPlaneDescriptor(windowDescriptor)) {
    return {
      ...windowDescriptor,
      type: 'treeNode',
      windows: normalizeWindows(windowDescriptor.windows)
    };
  }

  if (typeof (windowDescriptor) === 'string') {
    return {
      app: windowDescriptor,
      type: 'window'
    };
  }


  return {
    ...windowDescriptor,
    type: 'window'
  };
});

function isPlaneDescriptor(windowObject) {
  return windowObject.split === 'vertical' || windowObject.split === 'horizontal';
}

const transformWindows = R.compose(
  // addIndices,
  normalizeWindowObjects,
  // addWindowData(yabaiWindows),
  // addSpacesData(yabaiSpaces)
);

// Transduce the autobots array
const normalizeWindows = R.transduce(transformWindows, R.flip(R.append), []);


const defaultTreeNode = {
  split: 'vertical',
  type: 'treeNode'
};

function createWindowTree(windowConfig) {
  if (Array.isArray(windowConfig)) {
    return {
      ...defaultTreeNode,
      windows: normalizeWindows(windowConfig)
    };
  } else {
    return {
      ...windowConfig,
      type: 'treeNode',
      windows: normalizeWindows(windowConfig.windows)
    };
  }
}

module.exports = {
  createWindowTree
};
