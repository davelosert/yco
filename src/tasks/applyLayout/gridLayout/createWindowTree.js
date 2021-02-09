const R = require('ramda');

const normalizeWindowObjects = R.map(windowDescriptor => {
  if (isPlaneDescriptor(windowDescriptor)) {
    return {
      ...windowDescriptor,
      type: 'treeNode',
      windows: normalizeWindowObjects(windowDescriptor.windows)
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


const defaultTreeNode = {
  split: 'vertical',
  type: 'treeNode'
};

const createWindowTree = (windowConfig) => {
  if (Array.isArray(windowConfig)) {
    return {
      ...defaultTreeNode,
      windows: normalizeWindowObjects(windowConfig)
    };
  } else {
    return {
      ...windowConfig,
      type: 'treeNode',
      windows: normalizeWindowObjects(windowConfig.windows)
    };
  }
};

module.exports = {
  createWindowTree
};
