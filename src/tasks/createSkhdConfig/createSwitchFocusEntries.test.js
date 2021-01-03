
const { createSwitchFocusEntries } = require('./createSwitchFocusEntries');
const { describe } = require('riteway');


describe('createSwitchFocusEntries()', async assert => {
  assert({
    given: 'a config with one switchFocus entry',
    should: 'create an entry with a yco-switch-focus.js command for the given app',
    actual: createSwitchFocusEntries({
      switchFocusConfigs: [
        { triggerKey: 'cmd - 1', app: 'App 1' }
      ]
    }),
    expected: [
      'cmd - 1 : yco-switch-focus "App 1"',
    ],
  });

  assert({
    given: 'a config with two switchFocus entries',
    should: 'create an entry with a yco-switch-focus.js command for all apps',
    actual: createSwitchFocusEntries({
      switchFocusConfigs: [
        { triggerKey: 'cmd - 1', app: 'App 1' },
        { triggerKey: 'cmd - 2', app: 'App 2' }
      ]
    }),
    expected: [
      'cmd - 1 : yco-switch-focus "App 1"',
      'cmd - 2 : yco-switch-focus "App 2"',
    ],
  });
});
