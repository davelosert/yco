const { describe } = require('riteway');
const { createLayoutPlan } = require('../LayoutPlan');
const { createSpacePlan } = require('../SpacePlan');
const { leaveUntouched } = require('./leaveUntouched');

describe('leaveUntouched(unmanagedSpaces: YabaiSpace[], layoutPlan: LayoutPlan): LayoutPlan', async assert => {

  const existingSpace = createSpacePlan({ display: 1, index: 1 });
  const existingPlan = createLayoutPlan([
    existingSpace
  ]);

  assert({
    given: 'no unmanaged windows',
    should: 'return the layoutPlan as it was',
    actual: leaveUntouched([], existingPlan),
    expected: existingPlan
  });

  const unmanagedWindowSpace1 = { app: 'Unmanaged', id: 2, display: 1, space: 1 };
  assert({
    given: '1 unmanaged window on the 1st space off the display',
    should: 'creates an unmanaged space with a swapWith property of the index of the window',
    actual: leaveUntouched([unmanagedWindowSpace1], existingPlan),
    expected: createLayoutPlan([
      { ...existingSpace },
      { ...createSpacePlan({}), display: 1, index: 2, swapWith: 1, unmanagedWindows: [unmanagedWindowSpace1], unmanaged: true }
    ])
  });

  assert({
    given: '2 unmanaged windows on the 1st space off the display',
    should: 'creates an unmanaged space as last space on the 1st display with a swapWith property of the index of the windows.',
    actual: leaveUntouched([unmanagedWindowSpace1, unmanagedWindowSpace1], existingPlan),
    expected: createLayoutPlan([
      { ...existingSpace },
      { ...createSpacePlan({}), display: 1, index: 2, swapWith: 1, unmanagedWindows: [unmanagedWindowSpace1, unmanagedWindowSpace1], unmanaged: true }
    ])
  });

  const unmanagedWindowSpace4 = { ...unmanagedWindowSpace1, space: 4 };
  assert({
    given: '3 unmanaged spaces, two on the same space and one on another',
    should: 'create two unmanaged spaces as last spaces on the 1st display, each with a swapWith property',
    actual: leaveUntouched([unmanagedWindowSpace1, unmanagedWindowSpace1, unmanagedWindowSpace4], existingPlan),
    expected: createLayoutPlan([
      { ...existingSpace },
      { ...createSpacePlan({}), display: 1, index: 2, swapWith: 1, unmanagedWindows: [unmanagedWindowSpace1, unmanagedWindowSpace1], unmanaged: true },
      { ...createSpacePlan({}), display: 1, index: 3, swapWith: 4, unmanagedWindows: [unmanagedWindowSpace4], unmanaged: true }
    ])
  });

  const unmanagedWindowDisplay2 = { ...unmanagedWindowSpace1, display: 2, space: 2 };
  const existingSpaceDisplay2 = createSpacePlan({ display: 2, index: 2 });
  const spaceWithTwoDisplays = createLayoutPlan([
    existingSpace,
    existingSpaceDisplay2
  ]);

  assert({
    given: '2 unmanaged spaces, one on the first and one on the second display',
    should: 'create two unmanaged spaces and put them at the end of each display',
    actual: leaveUntouched([unmanagedWindowSpace1, unmanagedWindowDisplay2], spaceWithTwoDisplays),
    expected: createLayoutPlan([
      { ...existingSpace },
      { ...createSpacePlan({}), display: 1, index: 2, swapWith: 1, unmanagedWindows: [unmanagedWindowSpace1], unmanaged: true },
      { ...existingSpaceDisplay2, index: 3 },
      { ...createSpacePlan({}), display: 2, index: 4, swapWith: 2, unmanagedWindows: [unmanagedWindowDisplay2], unmanaged: true }
    ])
  });

});
