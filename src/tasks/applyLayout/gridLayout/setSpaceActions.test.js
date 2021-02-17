const { describe } = require('riteway');
const { setSpaceActions } = require('./setSpaceActions');
const { createWindowTree } = require('./WindowTree');

describe('setSpaceActions(yabaiSpaces, layoutPlan): LayoutPlan', async assert => {
  const yabaiSpace = { display: 1, index: 1 };
  const spacePlan = { display: 1, index: 1, windowTree: { type: 'treeNode', windows: [] } };

  assert({
    given: 'one existing space and one required space',
    should: 'set the action to "leave"',
    actual: setSpaceActions(
      [{ ...yabaiSpace }],
      [{ ...spacePlan }]
    ),
    expected: [{ ...spacePlan, action: 'leave' }]
  });

  assert({
    given: 'one existing space but two required spaces',
    should: 'set action of second space to "create"',
    actual: setSpaceActions(
      [{ ...yabaiSpace }],
      [{ ...spacePlan }, { ...spacePlan, index: 2 }]
    ),
    expected: [
      { ...spacePlan, action: 'leave' },
      { ...spacePlan, index: 2, action: 'create' }
    ]
  });

  assert({
    given: 'two existing spaces but only one required',
    should: 'set action of second space to "delete"',
    actual: setSpaceActions(
      [{ ...yabaiSpace }, { ...yabaiSpace, index: 2 }],
      [{ ...spacePlan }]
    ),
    expected: [
      { ...spacePlan, action: 'leave' },
      { ...yabaiSpace, index: 2, action: 'destroy', windowTree: createWindowTree() }
    ]
  });

  assert({
    given: 'a space to create on the second display',
    should: 'set action for the space to "create"',
    actual: setSpaceActions(
      [{ ...yabaiSpace }, { ...yabaiSpace, display: 2, index: 2 }],
      [{ ...spacePlan }, { ...spacePlan, index: 2, display: 2 }, { ...spacePlan, index: 3, display: 2 }]
    ),
    expected: [
      { ...spacePlan, action: 'leave' },
      { ...spacePlan, index: 2, display: 2, action: 'leave' },
      { ...spacePlan, index: 3, display: 2, action: 'create' }
    ]
  });

  // assert({
  //   given: 'yabai spaces on second display but no plans for it',
  //   should: 'create a space plan with action "leave" as last space on a display is not deletable',
  //   actual: setSpaceActions(
  //     [{ ...yabaiSpace }, { ...yabaiSpace, display: 2, index: 2 }],
  //     [{ ...spacePlan }]
  //   ),
  //   expected: [
  //     { ...spacePlan, action: 'leave' },
  //     { ...spacePlan, index: 2, display: 2, action: 'leave' },
  //   ]
  // });

  // assert({
  //   given: 'two spaces to create on the first display with existing spaces on the second',
  //   should: 'raise the index of all spaces on the second window accordingly',
  //   actual: setSpaceActions(
  //     [{ ...yabaiSpace }, { ...yabaiSpace, display: 2, index: 2 }],
  //     [{ ...spacePlan }, { ...spacePlan, index: 2, display: 1 }, { ...spacePlan, index: 3, display: 1 }]
  //   ),
  //   expected: [
  //     { ...spacePlan, action: 'leave' },
  //     { ...spacePlan, index: 2, display: 1, action: 'create' },
  //     { ...spacePlan, index: 3, display: 1, action: 'create' },
  //     { ...spacePlan, index: 4, display: 2, action: 'leave' },
  //   ]
  // });


  // assert({
  //   given: 'a space to delete on the first display but a space to create on the second',
  //   should: 'mark the space on the first with "delete" and the second with "create"',
  //   actual: setSpaceActions(
  //     [{ ...yabaiSpace }, { ...yabaiSpace, index: 2 }, { ...yabaiSpace, display: 2, index: 3 }],
  //     [{ ...spacePlan }, { ...spacePlan, display: 2, index: 2 }, { ...spacePlan, display: 2, index: 3 }]
  //   ),
  //   expected: [
  //     { ...spacePlan, display: 1, index: 1, action: 'leave' },
  //     { ...spacePlan, display: 1, index: 2, action: 'destroy' },
  //     { ...spacePlan, display: 2, index: 3, action: 'leave' },
  //     { ...spacePlan, display: 2, index: 4, action: 'create' },
  //   ]
  // });

});
