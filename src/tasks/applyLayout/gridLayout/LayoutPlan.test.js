const R = require('ramda');
const { describe } = require('riteway');
const { createSpacePlan } = require('./SpacePlan');
const { addSpacesToDisplay, createLayoutPlan, getDestructionOffset, getSwapTarget } = require('./LayoutPlan');

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

describe('LayoutPlan - addSpaceToDisplay(display: number, spaces: Space, layoutPlan: LayoutPlan): LayoutPlan', async assert => {

  const insertSpace = createSpacePlan({});

  assert({
    given: 'an empty layout',
    should: 'insert the space with an absolute index of 1',
    actual: addSpacesToDisplay(1, [insertSpace], createLayoutPlan()),
    expected: createLayoutPlan([
      {
        ...insertSpace,
        index: 1,
        display: 1
      }
    ])
  });

  const existingLayout = R.pipe(
    createLayoutPlan,
    addSpacesToDisplay(1, [insertSpace])
  )();

  assert({
    given: 'a layout with only 1 space on display 1',
    should: 'simply append the new space and set the absolute index to 2',
    actual: addSpacesToDisplay(1, [insertSpace], existingLayout),
    expected: createLayoutPlan([
      { ...insertSpace, index: 1, display: 1 },
      { ...insertSpace, index: 2, display: 1 }
    ])
  });

  assert({
    given: 'a layout with only one space on display 1 and inserting to display 2',
    should: 'append the new space and set the absolute index to 2',
    actual: addSpacesToDisplay(2, [insertSpace], existingLayout),
    expected: createLayoutPlan([
      { ...insertSpace, index: 1, display: 1 },
      { ...insertSpace, index: 2, display: 2 }
    ])
  });

  const complexLayout = R.pipe(
    createLayoutPlan,
    addSpacesToDisplay(1, [insertSpace, insertSpace]),
    addSpacesToDisplay(2, [insertSpace]),
    addSpacesToDisplay(3, [insertSpace, insertSpace])
  )();

  assert({
    given: 'a layout with existing spaces on the 1st and 3rd display, inserting into the second',
    should: 'raise the absolute indices of spaces on the third screen by the number of inserts',
    actual: addSpacesToDisplay(2, [insertSpace, insertSpace], complexLayout),
    expected: [
      { ...insertSpace, index: 1, display: 1 },
      { ...insertSpace, index: 2, display: 1 },
      { ...insertSpace, index: 3, display: 2 },
      { ...insertSpace, index: 4, display: 2 },
      { ...insertSpace, index: 5, display: 2 },
      { ...insertSpace, index: 6, display: 3 },
      { ...insertSpace, index: 7, display: 3 },
    ]
  });
});

describe('LayoutPlan - getSwapTarget(sourceIndex: number, layoutPlan: LayoutPlan): Index | Null', async assert => {
  assert({
    given: 'a space with "swapWith" === sourceIndex',
    should: 'return the spaces index',
    actual: getSwapTarget(1, createLayoutPlan([
      createSpacePlan({ display: 1, index: 1 }),
      createSpacePlan({ display: 1, index: 2, swapWith: 1, umanaged: true })
    ])),
    expected: 2
  });

  assert({
    given: 'no space with "swapWith" === sourceIndex exists',
    should: 'returns null',
    actual: getSwapTarget(1, createLayoutPlan([
      createSpacePlan({ display: 1, index: 1 }),
      createSpacePlan({ display: 1, index: 2 }),
      createSpacePlan({ display: 1, index: 3, swapWith: 2, umanaged: true })
    ])),
    expected: null
  });
});
