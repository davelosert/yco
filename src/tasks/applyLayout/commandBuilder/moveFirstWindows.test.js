const { createLayoutPlan } = require('../domain/LayoutPlan');
const { createSpacePlan } = require('../domain/SpacePlan');
const { createWindowTree } = require('../domain/WindowTree');
const { describe } = require('riteway');
const { moveFirstWindow } = require('./moveFirstWindows');

describe('moveFirstWindow(layoutPlan: LayoutPlan): Command[]', async assert => {
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
      createSpacePlan({ display: 2, index: 3, action: 'leave', windowTree: createWindowTree({ ...firstWindow, display: 2, space: 2 }) })
    ])),
    expected: []
  });

  assert({
    given: 'a layoutPlan where a space is swapped with the target space, putting the window in the wrong position',
    should: 'move the window to target if it got swapped away',
    actual: moveFirstWindow(createLayoutPlan([
      createSpacePlan({ display: 1, index: 1, action: 'leave', windowTree: createWindowTree({ ...firstWindow }) }),
      createSpacePlan({ display: 1, index: 2, action: 'leave', unmanaged: true, swapWith: 1 })
    ])),
    expected: [
      'yabai -m window 1 --space 1'
    ]
  });

  assert({
    given: 'a layoutPlan where a space is swapped with the target space, putting the window into the right position',
    should: 'return an empty array as no moving is necessary',
    actual: moveFirstWindow(createLayoutPlan([
      createSpacePlan({ display: 1, index: 1, action: 'leave', windowTree: createWindowTree({ ...firstWindow, space: 2 }) }),
      createSpacePlan({ display: 1, index: 2, action: 'leave', unmanaged: true, swapWith: 1 })
    ])),
    expected: []
  });
});
