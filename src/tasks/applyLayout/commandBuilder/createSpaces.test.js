const { describe } = require('riteway');
const { createLayoutPlan } = require('../domain/LayoutPlan');
const { createSpacePlan } = require('../domain/SpacePlan');
const { createSpaces } = require('./createSpaces');

describe(('createSpaces(layoutPlan: LayoutPlan): Commands[]'), async assert => {
  assert({
    given: 'only spaces to leave',
    should: 'return an empty array',
    actual: createSpaces(
      createLayoutPlan([
        createSpacePlan({ display: 1, index: 1, action: 'leave' }),
        createSpacePlan({ display: 1, index: 2, action: 'leave' })
      ])
    ),
    expected: []
  });

  assert({
    given: 'one space to create',
    should: 'focus the display of the space and add a space creation command',
    actual: createSpaces(
      createLayoutPlan([
        createSpacePlan({ display: 1, index: 1, action: 'leave' }),
        createSpacePlan({ display: 1, index: 2, action: 'create' })
      ])
    ),
    expected: [
      'yabai -m display --focus 1',
      'yabai -m space --create'
    ]
  });

  assert({
    given: 'two spaces to create on two displays',
    should: 'create the spaces one display after the other',
    actual: createSpaces(
      createLayoutPlan([
        createSpacePlan({ display: 1, index: 1, action: 'leave' }),
        createSpacePlan({ display: 1, index: 2, action: 'create' }),
        createSpacePlan({ display: 1, index: 3, action: 'create' }),
        createSpacePlan({ display: 2, index: 4, action: 'leave' }),
        createSpacePlan({ display: 2, index: 5, action: 'create' }),
        createSpacePlan({ display: 2, index: 6, action: 'create' })
      ])
    ),
    expected: [
      'yabai -m display --focus 1',
      'yabai -m space --create',
      'yabai -m space --create',
      'yabai -m display --focus 2',
      'yabai -m space --create',
      'yabai -m space --create',
    ]

  });

});
