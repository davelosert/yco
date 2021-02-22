const { createLayoutPlan } = require('../domain/LayoutPlan');
const { createSpacePlan } = require('../domain/SpacePlan');
const { describe } = require('riteway');
const { swapUnmanagedSpaces } = require('./swapUnmanagedSpaces');

describe('swapUnmanagedSpaces(layoutPlan: LayoutPlan): Command[]', async assert => {
  assert({
    given: 'no unmanaged spaces',
    should: 'return empty array',
    actual: swapUnmanagedSpaces(createLayoutPlan([createSpacePlan({ action: 'leave' })])),
    expected: []
  });

  const unmanagedSpace = createSpacePlan({ display: 1, index: 2, unmanagedWindows: [{ display: 1, index: 1, app: 'Unmanaged', id: 2 }], swapWith: 1 });
  assert({
    given: 'one unmanaged space with target index 2 to swap with index 1',
    should: 'create yabai space swap command to swap it to index 2',
    actual: swapUnmanagedSpaces(
      createLayoutPlan([
        createSpacePlan({ index: 1, action: 'leave' }),
        unmanagedSpace
      ]),
    ),
    expected: [
      'yabai -m space 1 --swap 2'
    ]
  });

  assert({
    given: 'one unmanaged space with target index same as current index',
    should: 'return empty array',
    actual: swapUnmanagedSpaces(
      createLayoutPlan([
        createSpacePlan({ index: 1, action: 'leave' }),
        { ...unmanagedSpace, swapWith: 2 }
      ])
    ),
    expected: []
  });

  const unmanagedSpaceDisplay2 = createSpacePlan({ display: 2, index: 4, unmanagedWindows: [{ display: 2, index: 2, app: 'Unmanaged', id: 2 }], swapWith: 2 });
  assert({
    given: 'an unmanaged space on the second display when there is an index-offset due to a space that will be created on the first',
    should: 'take that offset into consideration for swapping',
    actual: swapUnmanagedSpaces(
      createLayoutPlan([
        createSpacePlan({ display: 1, index: 1, action: 'leave' }),
        createSpacePlan({ display: 1, index: 2, action: 'create' }),
        createSpacePlan({ display: 1, index: 3, action: 'leave' }),
        unmanagedSpaceDisplay2
      ])
    ),
    expected: [
      'yabai -m space 3 --swap 4'
    ]
  });
});
