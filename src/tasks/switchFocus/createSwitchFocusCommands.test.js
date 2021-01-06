const { createSwitchFocusCommands } = require('./createSwitchFocusCommands');
const { describe } = require('riteway');

describe('createSwitchFocusCommands()', async assert => {
  assert({
    given: 'window to focus is already focused',
    should: 'return an empty array',
    actual: createSwitchFocusCommands({
      actualWindows: [{ app: 'WindowToFocus', id: 1, space: 1, display: 1, focused: 1 }],
      actualSpaces: [{ index: 1, focused: 1 }],
      windowToFocus: { app: 'WindowToFocus' },
    }),
    expected: [],
  });

  assert({
    given: 'window to focus does not exist',
    should: 'return empty array',
    actual: createSwitchFocusCommands({
      actualWindows: [
        { app: 'Window in Focus', id: 1, space: 1, display: 1, focused: 1 },
      ],
      actualSpaces: [{ index: 1, focused: 1 }],
      windowToFocus: { app: 'Non Existing Window' }
    }),
    expected: []
  });

  assert({
    given: 'window to focus on same space',
    should: 'return only focus window command with window id',
    actual: createSwitchFocusCommands({
      actualWindows: [
        { app: 'WindowToFocus', id: 1, space: 1, display: 1, focused: 0 },
        { app: 'WindowInFocus', id: 2, space: 1, display: 1, focused: 1 }
      ],
      actualSpaces: [{ index: 1, focused: 1 }],
      windowToFocus: { app: 'WindowToFocus' }
    }),
    expected: [
      'yabai -m window --focus 1'
    ],
  });

  assert({
    given: '2 windows that match windowToFocus where none are focused',
    should: 'focus commands for the first window',
    actual: createSwitchFocusCommands({
      actualWindows: [
        { app: 'Other Window', id: 1, space: 1, display: 1, focused: 1 },
        { app: 'WindowToFocus', id: 2, space: 2, display: 1, focused: 0 },
        { app: 'WindowToFocus', id: 3, space: 3, display: 1, focused: 0 }
      ],
      actualSpaces: [{ index: 1, focused: 1 }, { index: 2, focused: 0 }, { index: 3, focused: 0 }],
      windowToFocus: { app: 'WindowToFocus' }
    }),
    expected: [
      'yabai -m space --focus 2',
      'yabai -m window --focus 2'
    ],
  });

  assert({
    given: '2 windows that match windowToFocus where one is already focused',
    should: 'return focus commands for second window',
    actual: createSwitchFocusCommands({
      actualWindows: [
        { app: 'WindowToFocus', id: 1, space: 1, display: 1, focused: 1 },
        { app: 'WindowToFocus', id: 2, space: 2, display: 1, focused: 0 }
      ],
      actualSpaces: [{ index: 1, focused: 1 }, { index: 2, focused: 0 }],
      windowToFocus: { app: 'WindowToFocus' }
    }),
    expected: [
      'yabai -m space --focus 2',
      'yabai -m window --focus 2'
    ],
  });

  assert({
    given: '3 windows that match windowToFocus where second one is already focused',
    should: 'return focus commands for third window',
    actual: createSwitchFocusCommands({
      actualWindows: [
        { app: 'WindowToFocus', id: 1, space: 1, display: 1, focused: 0 },
        { app: 'WindowToFocus', id: 2, space: 2, display: 1, focused: 1 },
        { app: 'WindowToFocus', id: 3, space: 3, display: 1, focused: 0 }
      ],
      actualSpaces: [{ index: 1, focused: 0 }, { index: 2, focused: 1 }, { index: 3, focused: 0 }],
      windowToFocus: { app: 'WindowToFocus' }
    }),
    expected: [
      'yabai -m space --focus 3',
      'yabai -m window --focus 3'
    ],
  });

  assert({
    given: 'no focused window exists',
    should: 'return focuse commands for the first match',
    actual: createSwitchFocusCommands({
      actualWindows: [
        { app: 'WindowToFocus', id: 1, space: 1, display: 1, focused: 0 },
      ],
      actualSpaces: [{ index: 1, focused: 0 }, { index: 2, focused: 1 }],
      windowToFocus: { app: 'WindowToFocus' }
    }),
    expected: [
      'yabai -m space --focus 1',
      'yabai -m window --focus 1'
    ],
  });

});
