const { allInOwnSpace } = require('./allInOwnSpace');
const { createLayoutPlan } = require('../../domain/LayoutPlan');
const { createSpacePlan } = require('../../domain/SpacePlan');
const { createWindowTree } = require('../../domain/WindowTree');
const { describe } = require('riteway');


describe('allInOneSpace(unmanagedSpaces: YabaiSpace[], layoutPlan: LayoutPlan): LayoutPlan', async assert => {

  const existingSpace = createSpacePlan({ display: 1, index: 1 });
  const existingPlan = createLayoutPlan([
    existingSpace
  ]);

  assert({
    given: 'no unmanaged windows',
    should: 'return the layoutPlan as it was',
    actual: allInOwnSpace([], existingPlan),
    expected: existingPlan
  });



  const unmanagedApp = { app: 'Unmanaged', id: 2, index: 1, display: 1 };
  assert({
    given: 'one unmanaged window',
    should: 'return the window in a newly created space on first display',
    actual: allInOwnSpace([{ ...unmanagedApp }], existingPlan),
    expected: createLayoutPlan([
      existingSpace,
      createSpacePlan(
        {
          display: 1, index: 2, windowTree: createWindowTree({
            windows: [{ ...unmanagedApp, type: 'window' }]
          })
        })
    ])
  });

  assert({
    given: 'two unmanaged windows',
    should: 'return each window in their own space on the first display',
    actual: allInOwnSpace([{ ...unmanagedApp }, { ...unmanagedApp, id: 3 }], existingPlan),
    expected: createLayoutPlan([
      existingSpace,
      createSpacePlan({
        display: 1, index: 2, windowTree: createWindowTree({
          windows: [{ ...unmanagedApp, type: 'window' }]
        })
      }),
      createSpacePlan({
        display: 1, index: 3, windowTree: createWindowTree({
          windows: [{ ...unmanagedApp, id: 3, type: 'window' }]
        })
      })
    ])
  });
});
