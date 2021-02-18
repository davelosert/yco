const { describe } = require('riteway');
const { createSpacePlan } = require('./SpacePlan');
const { createLayoutPlan, getDestructionOffset, } = require('./LayoutPlan');

describe('LayoutPlan - getDestructionOffset(display: number, layoutPlan: LayoutPlan): number', async assert => {


  const simpleLayoutPlan = createLayoutPlan([
    createSpacePlan({ action: 'leave ' })
  ]);

  assert({
    given: 'no spaces to destroy on the first display',
    should: 'return 0',
    actual: getDestructionOffset(2, simpleLayoutPlan),
    expected: 0
  });


  const layoutWithDestroyOnFirst = createLayoutPlan([
    createSpacePlan({ display: 1, index: 1, action: 'leave' }),
    createSpacePlan({ display: 1, index: 2, action: 'destroy' })
  ]);
  assert({
    given: 'one space to destroy on the first display',
    should: 'return offset of 1 for the second',
    actual: getDestructionOffset(2, layoutWithDestroyOnFirst),
    expected: 1
  });

  const layoutWithDestroyOnFirstAndSecond = createLayoutPlan([
    createSpacePlan({ display: 1, index: 1, action: 'leave' }),
    createSpacePlan({ display: 1, index: 2, action: 'destroy' }),
    createSpacePlan({ display: 2, index: 3, action: 'leave' }),
    createSpacePlan({ display: 2, index: 4, action: 'destroy' })
  ]);

  assert({
    given: 'one space to destroy on the first and second display',
    should: 'return offset of 1 for the second',
    actual: getDestructionOffset(2, layoutWithDestroyOnFirstAndSecond),
    expected: 1
  });

  assert({
    given: 'one space to destroy on the first and second display',
    should: 'return offset of 2 for the third',
    actual: getDestructionOffset(3, layoutWithDestroyOnFirstAndSecond),
    expected: 2
  });
});
