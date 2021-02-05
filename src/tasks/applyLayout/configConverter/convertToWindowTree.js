const { createWindowTree } = require('../domain/WindowTree');
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

const convertToWindowTree = (windowConfig) => {
  if (Array.isArray(windowConfig)) {
    return createWindowTree({
      windows: normalizeWindowObjects(windowConfig)
    });
  } else {
    return createWindowTree({
      ...windowConfig,
      windows: normalizeWindowObjects(windowConfig.windows)
    });
  }
};

module.exports = {
  convertToWindowTree
};
