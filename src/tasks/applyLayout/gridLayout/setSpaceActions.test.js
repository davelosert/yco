const { describe } = require('riteway');
const { setSpaceActions } = require('./setSpaceActions');
const { createWindowTree } = require('./WindowTree');
const { createSpacePlan } = require('./SpacePlan');

describe('setSpaceActions(yabaiSpaces, layoutPlan): LayoutPlan', async assert => {
  const yabaiSpace = { display: 1, index: 1 };
  const spacePlan = createSpacePlan({ display: 1, index: 1 });

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
      createSpacePlan({ ...yabaiSpace, index: 2, action: 'destroy', windowTree: createWindowTree() })
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

  assert({
    given: 'yabai spaces on second display but no plans for it',
    should: 'ignore that display entirely.',
    actual: setSpaceActions(
      [{ ...yabaiSpace }, { ...yabaiSpace, display: 2, index: 2 }],
      [{ ...spacePlan }]
    ),
    expected: [
      { ...spacePlan, action: 'leave' }
    ]
  });

  assert({
    given: 'two spaces to create on the first display with an existing space on the second display',
    should: 'mark the space on the second display with action "leave" as it already exists',
    actual: setSpaceActions(
      [{ ...yabaiSpace }, { ...yabaiSpace, display: 2, index: 2 }],
      [{ ...spacePlan }, { ...spacePlan, index: 2, display: 1 }, { ...spacePlan, index: 3, display: 1 }, { ...spacePlan, index: 4, display: 2 }]
    ),
    expected: [
      { ...spacePlan, action: 'leave' },
      { ...spacePlan, index: 2, display: 1, action: 'create' },
      { ...spacePlan, index: 3, display: 1, action: 'create' },
      { ...spacePlan, index: 4, display: 2, action: 'leave' },
    ]
  });

  assert({
    given: 'a space to delete on the first display with existing spaces on the second display',
    should: 'increase the absolute index of the spaces on the second display as deletion happens in the end',
    actual: setSpaceActions(
      [{ ...yabaiSpace }, { ...yabaiSpace, index: 2 }, { ...yabaiSpace, display: 2, index: 3 }],
      [{ ...spacePlan }, { ...spacePlan, display: 2, index: 2 }, { ...spacePlan, display: 2, index: 3 }]
    ),
    expected: [
      { ...spacePlan, display: 1, index: 1, action: 'leave' },
      { ...spacePlan, display: 1, index: 2, action: 'destroy' },
      { ...spacePlan, display: 2, index: 3, action: 'leave' },
      { ...spacePlan, display: 2, index: 4, action: 'create' },
    ]
  });


  assert({
    given: 'a space to create on the first and two spaces to delete on the second display',
    should: 'set the correct indices',
    actual: setSpaceActions(
      [{ ...yabaiSpace }, { ...yabaiSpace, display: 2, index: 2 }, { ...yabaiSpace, display: 2, index: 3 }, { ...yabaiSpace, display: 2, index: 4 }],
      [{ ...spacePlan }, { ...spacePlan, display: 1, index: 2 }, { ...spacePlan, display: 2, index: 3 }]
    ),
    expected: [
      { ...spacePlan, display: 1, index: 1, action: 'leave' },
      { ...spacePlan, display: 1, index: 2, action: 'create' },
      { ...spacePlan, display: 2, index: 3, action: 'leave' },
      { ...spacePlan, display: 2, index: 4, action: 'destroy' },
      { ...spacePlan, display: 2, index: 5, action: 'destroy' }
    ]
  });

});
