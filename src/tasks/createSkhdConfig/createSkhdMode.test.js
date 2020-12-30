const { createSkhdMode } = require('./createSkhdMode');
const { describe } = require('riteway');


describe('createSkhdMode()', async assert => {
  assert({
    given: 'a config with name "testMode" and trigger-key "alt -s"',
    should: 'create an array with the mode declaration, the trigger and mode-end.',
    actual: createSkhdMode({
      name: 'testMode',
      triggerKey: 'alt - s',
      entries: []
    }),
    expected: [
      ':: testMode @',
      'alt - s ; testMode',
      'testMode < escape ; default'
    ],
  });

  assert({
    given: 'a config with single entry with a single action',
    should: 'create the entry prefixed with the mode name and with a keysym to exit the mode',
    actual: createSkhdMode({
      name: 'testMode',
      triggerKey: 'alt - s',
      entries: [{ triggerKey: 'l', actions: ['yco apply-layout --name test'] }]
    }),
    expected: [
      ':: testMode @',
      'alt - s ; testMode',
      'testMode < l : yco apply-layout --name test | skhd -k "escape"',
      'testMode < escape ; default'
    ],
  });

  assert({
    given: 'a config with single entry with a single action',
    should: 'create the entry prefixed with the mode name and with a keysym to exit the mode',
    actual: createSkhdMode({
      name: 'testMode',
      triggerKey: 'alt - s',
      entries: [{ triggerKey: 't', actions: ['yco apply-layout --name test', 'echo "hello"'] }]
    }),
    expected: [
      ':: testMode @',
      'alt - s ; testMode',
      'testMode < t : yco apply-layout --name test | echo "hello" | skhd -k "escape"',
      'testMode < escape ; default'
    ],
  });

  assert({
    given: 'a config with multiple entries',
    should: 'create all entries within the mode with a keysm to exit the mode',
    actual: createSkhdMode({
      name: 'testMode',
      triggerKey: 'alt - s',
      entries: [
        { triggerKey: 't', actions: ['yco apply-layout --name test'] },
        { triggerKey: 'alt - a', actions: ['yco apply-layout --name anotherLayout'] },
      ]
    }),
    expected: [
      ':: testMode @',
      'alt - s ; testMode',
      'testMode < t : yco apply-layout --name test | skhd -k "escape"',
      'testMode < alt - a : yco apply-layout --name anotherLayout | skhd -k "escape"',
      'testMode < escape ; default'
    ],
  });
});
