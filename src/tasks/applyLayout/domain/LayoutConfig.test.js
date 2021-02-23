const { createLayoutConfig, getAllApps } = require('./LayoutConfig');
const { describe } = require('riteway');
describe.only('LayoutConfig - getAllApps(layoutConfig: LayoutConfig): string[]', async assert => {

  assert({
    given: 'an empty layoutConfig',
    should: 'return an empty array',
    actual: getAllApps(createLayoutConfig({ spaces: [[]] })),
    expected: []
  });

  assert({
    given: 'one app as string on the first space',
    should: 'return the name of the app',
    actual: getAllApps(createLayoutConfig({
      spaces: [[['FirstApp']]]
    })),
    expected: ['FirstApp']
  });

  assert({
    given: 'two apps as strings on two spaces',
    should: 'return both as array',
    actual: getAllApps(createLayoutConfig({
      spaces: [[['FirstApp']], [['SecondApp']]]
    })),
    expected: ['FirstApp', 'SecondApp']
  });

  assert({
    given: 'the same app title twice',
    should: 'return both in array',
    actual: getAllApps(createLayoutConfig({
      spaces: [[['FirstApp']], [['FirstApp']]]
    })),
    expected: ['FirstApp', 'FirstApp']
  });

  assert({
    given: 'an app defined as a window object',
    should: 'return the content of the "app" property',
    actual: getAllApps(createLayoutConfig({
      spaces: [[[{ app: 'FirstApp' }]]]
    })),
    expected: ['FirstApp']
  });

  assert({
    given: 'a space with windows within a split',
    should: 'return all the apps within the split',
    actual: getAllApps(createLayoutConfig({
      spaces: [[[{ split: 'vertical', windows: ['FirstApp'] }]]]
    })),
    expected: ['FirstApp']
  });

});
