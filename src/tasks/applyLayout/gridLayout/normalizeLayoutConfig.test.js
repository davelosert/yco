const { describe } = require('riteway');
const { normalizeLayoutConfig } = require('./normalizeLayoutConfig');
const { createLayoutPlan } = require('./LayoutPlan');
const { createSpacePlan } = require('./SpacePlan');
const { createWindowTree } = require('./WindowTree');


describe('normalizeLayoutConfig()', async assert => {
  const emptyTreeNode = createWindowTree();
  assert({
    given: 'no window at all',
    should: 'return only space with with no windows',
    actual: normalizeLayoutConfig([[[]]]),
    expected: createLayoutPlan([createSpacePlan({
      display: 1,
      index: 1,
      windowTree: emptyTreeNode
    })])
  });

  assert({
    given: 'empty spaces on two displays',
    should: 'set correct display index and an absolute space index',
    actual: normalizeLayoutConfig([
      [[]],
      [[]]
    ]),
    expected: createLayoutPlan([
      createSpacePlan({ display: 1, index: 1, windowTree: emptyTreeNode }),
      createSpacePlan({ display: 2, index: 2, windowTree: emptyTreeNode })
    ])
  });

  assert({
    given: 'space with window as string',
    should: 'normalized treeNode with a single window with string in app field',
    actual: normalizeLayoutConfig([
      [['FireFox']]
    ]),
    expected: createLayoutPlan([
      createSpacePlan({
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
      })
    ])
  });

  assert({
    given: 'space with a window as object',
    should: 'only add "type: window"',
    actual: normalizeLayoutConfig([
      [[{ app: 'FireFox', size: '4/4' }]]
    ]),
    expected: createLayoutPlan([
      createSpacePlan({
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
      })
    ])
  });

  assert({
    given: 'a space with only a horizontal split object',
    should: 'treat it as a tree node and insert windows as window objects',
    actual: normalizeLayoutConfig([
      [[
        { split: 'horizontal', windows: ['FireFox', 'iTerm2'] }]]
    ]),
    expected: createLayoutPlan([
      createSpacePlan({
        display: 1,
        index: 1,
        windowTree: {
          type: 'treeNode',
          split: 'vertical',
          windows: [{
            type: 'treeNode',
            split: 'horizontal',
            windows: [{
              type: 'window',
              app: 'FireFox',
            },
            {
              type: 'window',
              app: 'iTerm2'
            }]
          }]
        }
      })
    ])
  });

  assert({
    given: 'a space with only a horizontal split object as root object',
    should: 'have the horizontal tree node as top level object',
    actual: normalizeLayoutConfig([
      [{ split: 'horizontal', windows: ['FireFox', 'iTerm2'] }]
    ]),
    expected: createLayoutPlan([
      createSpacePlan({
        display: 1,
        index: 1,
        windowTree: {
          type: 'treeNode',
          split: 'horizontal',
          windows: [{
            type: 'window',
            app: 'FireFox',
          },
          {
            type: 'window',
            app: 'iTerm2'
          }]
        }
      })
    ])
  });

  assert({
    given: 'a space with a horizontal split and a string object',
    should: 'insert a vertical split as rootObject and create the horizontalTree Node and a normal window object as siblings',
    actual: normalizeLayoutConfig([
      [[{ split: 'horizontal', windows: ['iTerm2', 'iTerm2'] }, 'FireFox']]
    ]),
    expected: createLayoutPlan([
      createSpacePlan({
        display: 1,
        index: 1,
        windowTree: {
          type: 'treeNode',
          split: 'vertical',
          windows: [
            {
              type: 'treeNode',
              split: 'horizontal',
              windows: [{ type: 'window', app: 'iTerm2', }, { type: 'window', app: 'iTerm2' }]
            },
            {
              type: 'window',
              app: 'FireFox'
            }
          ]
        }
      })
    ])

  });
});
