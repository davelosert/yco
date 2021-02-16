const { describe } = require('riteway');
const { setSpaceActions } = require('./setSpaceActions');
const { defaultWindowTree } = require('./WindowTree');

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
      { ...yabaiSpace, index: 2, action: 'destroy', windowTree: defaultWindowTree }
    ]
  });

});
