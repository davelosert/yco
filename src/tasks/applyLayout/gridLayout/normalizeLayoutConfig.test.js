const { describe } = require('riteway');
const { normalizeLayoutConfig } = require('./normalizeLayoutConfig');

const initial = [
  { 'windows': ['iTerm2', 'iTerm2'], 'split': 'horizontal', 'size': '1/4' },
  { 'windows': ['Code'], 'size': '2/4' },
  'FireFox'
];

const expected = {
  type: 'treeNode',
  split: 'vertical',
  windows: [{
    type: 'treeNode',
    split: 'horizontal',
    windows: ['iTerm2', 'iTerm2']
  }, {
    type: 'window',
    app: 'Code'
  }]

};
const emptyTreeNode = {
  type: 'treeNode',
  split: 'vertical',
  windows: []
};

describe.only('normalizeLayoutConfig()', async assert => {
  assert({
    given: 'no window at all',
    should: 'return only space with with no windows',
    actual: normalizeLayoutConfig([[[]]]),
    expected: [{
      display: 1,
      index: 1,
      windowTree: emptyTreeNode
    }]
  });

  assert({
    given: 'empty spaces on two displays',
    should: 'set correct display index and an absolute space index',
    actual: normalizeLayoutConfig([
      [[]],
      [[]]
    ]),
    expected: [
      { display: 1, index: 1, windowTree: emptyTreeNode },
      { display: 2, index: 2, windowTree: emptyTreeNode }
    ]
  });

  assert({
    given: 'space with window described as string',
    should: 'normalized treeNode with a single window with string in app field',
    actual: normalizeLayoutConfig([
      [['FireFox']]
    ]),
    expected: [
      {
        display: 1,
        index: 1,
        windowTree: {
          type: 'treeNode',
          split: 'vertical',
          windows: [{
            type: 'window',
            app: 'FireFox'
          }]
        }
      }
    ]
  });

  assert({
    given: 'space with window described as window with size',
    should: 'only add "type: window"',
    actual: normalizeLayoutConfig([
      [[{ app: 'FireFox', size: '4/4' }]]
    ]),
    expected: [
      {
        display: 1,
        index: 1,
        windowTree: {
          type: 'treeNode',
          split: 'vertical',
          windows: [{
            type: 'window',
            app: 'FireFox',
            size: '4/4'
          }]
        }
      }
    ]
  });

  // assert({
  //   given: 'only a window defined by a string',
  //   should: 'return a node of type window with the window itself',
  //   actual: normalizeTreeConfig(['TestApp']),
  //   expected: {
  //     type: 'window',
  //     app: 'TestApp'
  //   }
  // });

});
