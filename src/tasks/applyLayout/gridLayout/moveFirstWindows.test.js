const { createWindowTree } = require('./WindowTree');
const { describe } = require('riteway');
const { moveFirstWindow } = require('./moveFirstWindows');
const { createSpacePlan } = require('./SpacePlan');
const { createLayoutPlan } = require('./LayoutPlan');

describe.skip('moveFirstWindow(layoutPlan: LayoutPlan): Command[]', async assert => {
  const firstWindow = createWindowTree({
    type: 'window',
    app: 'test',
    id: 1,
    space: 1,
    display: 1
  });

  const aSpaceWith = (windowTree) => createSpacePlan({
    display: 1,
    index: 1,
    windowTree: {
      ...windowTree
    }
  });

  assert({
    given: 'a space with a window on the target space',
    should: 'return an empty array',
    actual: moveFirstWindow([aSpaceWith(firstWindow)]),
    expected: []
  });

  assert({
    given: 'a space with a window on another space on the same display',
    should: 'return yabai command to move the window to the given space',
    actual: moveFirstWindow([aSpaceWith({ ...firstWindow, space: 2 })]),
    expected: ['yabai -m window 1 --space 1']
  });

  assert({
    given: 'a layoutPlan where a space is to be created on the first display, offsetting the index for all spaces on the second display',
    should: 'recognize the offset and not create a move command for a window that is effectively on the correct space',
    actual: moveFirstWindow(createLayoutPlan([
      createSpacePlan({ display: 1, index: 1, action: 'leave' }),
      createSpacePlan({ display: 1, index: 2, action: 'create' }),
      createSpacePlan({ display: 2, index: 3, action: 'leave', windowTree: createWindowTree({ ...firstWindow, display: 2, index: 2 }) })
    ])),
    expected: []
  });
});
