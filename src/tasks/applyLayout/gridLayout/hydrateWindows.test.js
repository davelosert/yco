const { describe } = require('riteway');
const { hydrateWindows } = require('./hydrateWindows');
const { NODE_TYPES } = require('./WindowTree');


describe.only('findYabaiWindow()', async assert => {
  assert({
    given: 'no windows defined in treenode',
    should: 'return empty windowTree',
    actual: hydrateWindows(
      [{ app: 'test' }],
      { split: 'vertical', type: NODE_TYPES.TREE_NODE, windows: [] }
    ),
    expected: { split: 'vertical', type: NODE_TYPES.TREE_NODE, windows: [] }
  });

  const matchingWindow = { id: 1, app: 'test', space: 1, display: 1 };
  assert({
    given: 'window match by app',
    should: 'merge the matching window within the tree',
    actual: hydrateWindows(
      [{ ...matchingWindow }],
      { split: 'vertical', type: NODE_TYPES.TREE_NODE, windows: [{ type: NODE_TYPES.WINDOW, app: 'test' }] }
    ),
    expected: { split: 'vertical', type: NODE_TYPES.TREE_NODE, windows: [{ type: NODE_TYPES.WINDOW, ...matchingWindow }] }
  });

  const matchingWindow2 = { id: 2, app: 'test2', space: 1, display: 1 };
  const matchingWindow3 = { id: 3, app: 'test3', space: 2, display: 2 };
  assert({
    given: 'a window-tree with deep nested windows',
    should: 'insert matches on all levels of the tree',
    actual: hydrateWindows(
      [{ ...matchingWindow }, { ...matchingWindow2 }, { ...matchingWindow3 }],
      {
        split: 'vertical', type: NODE_TYPES.TREE_NODE, windows: [
          { type: NODE_TYPES.WINDOW, app: 'test' },
          {
            type: NODE_TYPES.TREE_NODE, split: 'horizontal', windows: [
              { type: NODE_TYPES.WINDOW, app: 'test2' },
              { type: NODE_TYPES.WINDOW, app: 'test3' }
            ]
          }
        ]
      }
    ),
    expected: {
      split: 'vertical', type: NODE_TYPES.TREE_NODE, windows: [
        { type: NODE_TYPES.WINDOW, ...matchingWindow },
        {
          type: NODE_TYPES.TREE_NODE, split: 'horizontal', windows: [
            { type: NODE_TYPES.WINDOW, ...matchingWindow2 },
            { type: NODE_TYPES.WINDOW, ...matchingWindow3 }
          ]
        }
      ]
    }
  });
});
