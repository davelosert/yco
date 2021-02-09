const R = require('ramda');

const NODE_TYPES = {
  TREE_NODE: 'treeNode',
  WINDOW: 'window'
};

const isWindow = node => node.type === NODE_TYPES.WINDOW;
const mapWindows = R.curry((mappingFunc, node) => {
  if (isWindow(node)) {
    return mappingFunc(node);
  }

  return {
    ...node,
    windows: node.windows.map(mapWindows(mappingFunc))
  };
});


module.exports = {
  mapWindows,
  NODE_TYPES
};
