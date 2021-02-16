const R = require('ramda');

const NODE_TYPES = {
  TREE_NODE: 'treeNode',
  WINDOW: 'window'
};

const defaultWindowTree = {
  type: NODE_TYPES.TREE_NODE,
  split: 'vertical',
  windows: []
};

const createWindowTree = props => ({
  ...defaultWindowTree,
  ...props
});

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

const getMostLeftWindowOf = (node) => {
  if (node.type === 'window') {
    return node;
  }

  return getMostLeftWindowOf(node.windows[0]);
};

module.exports = {
  createWindowTree,
  mapWindows,
  getMostLeftWindowOf,
  NODE_TYPES
};
