const { describe } = require('riteway');
const { createLayoutPlan } = require('./LayoutPlan');
const { createSpacePlan } = require('./SpacePlan');
const { destroySpaces } = require('./destroySpaces');

describe('destroySpaces(layoutPlan: LayoutPlan): Commands[]', async assert => {

  assert({
    given: 'plan with no spaces to delete',
    should: 'return empty array',
    actual: destroySpaces(createLayoutPlan([
      createSpacePlan({ action: 'leave ' })
    ])),
    expected: []
  });

  assert({
    given: 'one space to destroy',
    should: 'return a yabai delete space command for the absolute index',
    actual: destroySpaces(createLayoutPlan([
      createSpacePlan({ display: 1, index: 1, action: 'leave' }),
      createSpacePlan({ display: 1, index: 2, action: 'destroy' }),
    ]
    )),
    expected: [
      'yabai -m space 2 --destroy'
    ]
  });

  assert({
    given: 'several spaces to destroy',
    should: 'destory those spaces from highest index to lowest to avoid absolute index problems.',
    actual: destroySpaces(createLayoutPlan([
      createSpacePlan({ display: 1, index: 1, action: 'leave' }),
      createSpacePlan({ display: 1, index: 2, action: 'destroy' }),
      createSpacePlan({ display: 1, index: 3, action: 'destroy' }),
    ]
    )),
    expected: [
      'yabai -m space 3 --destroy',
      'yabai -m space 2 --destroy',
    ]
  });

});
