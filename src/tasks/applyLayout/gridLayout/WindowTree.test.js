const { describe } = require('riteway');
const { getMostLeftWindowOf } = require('./WindowTree');
const { mapWindows, NODE_TYPES } = require('./WindowTree');


describe('mapWindows()', async assert => {
  const emptyTree = {
    type: NODE_TYPES.TREE_NODE,
    split: 'vertical',
    windows: []
  };
  const addTestAttribute = (window) => ({
    ...window,
    mapped: true
  });

  assert({
    given: 'a tree with now windows',
    should: 'return the same tree',
    actual: mapWindows(addTestAttribute, emptyTree),
    expected: emptyTree
  });

  const testWindow = { type: NODE_TYPES.WINDOW, app: 'test' };
  assert({
    given: 'a tree with a single window',
    should: 'return tree with mapped window',
    actual: mapWindows(addTestAttribute, {
      ...emptyTree,
      windows: [{ ...testWindow }]
    }),
    expected: {
      ...emptyTree,
      windows: [{ ...testWindow, mapped: true }]
    }
  });

  const nestedTree = {
    ...emptyTree,
    windows: [
      { ...testWindow },
      { ...emptyTree, windows: [{ ...testWindow }, { ...testWindow }] }
    ]
  };

  assert({
    given: 'a tree with windows nested in a childtree',
    should: 'return tree with mapped windows on all childtree levels',
    actual: mapWindows(addTestAttribute, nestedTree),
    expected: {
      ...emptyTree,
      windows: [
        { ...testWindow, mapped: true },
        { ...emptyTree, windows: [{ ...testWindow, mapped: true }, { ...testWindow, mapped: true }] }
      ]
    }

  });

});


describe('getMostLeftWindow', async assert => {
  const searchWindow = { app: 'test', id: 1, type: 'window' };
  const secondaryWindow = { ...searchWindow, id: 2 };
  const aTreeNodeWith = (windows) => ({
    type: 'treeNode',
    split: 'vertical',
    windows: [...windows]
  });

  assert({
    given: 'a tree with only a window node',
    should: 'return the window',
    actual: getMostLeftWindowOf(searchWindow),
    expected: searchWindow
  });

  assert({
    given: 'a tree with the two windows nested under a treeNode',
    should: 'return the first window of the treeNode',
    actual: getMostLeftWindowOf(aTreeNodeWith([searchWindow, secondaryWindow])),
    expected: searchWindow
  });

  assert({
    given: 'a tree with the first window deep nested under several treeNodes',
    should: 'return the window',
    actual: getMostLeftWindowOf(
      aTreeNodeWith([aTreeNodeWith([searchWindow, secondaryWindow])])
    ),
    expected: searchWindow
  });


});
