const { describe } = require('riteway');
const { createWindowCommands } = require('./createWindowCommands');

describe('createWindowComands()', async assert => {
  const testApp = { id: 1, app: 'TestApp', display: 1, space: 1 };
  const testAppSpace3 = { id: 3, app: 'TestApp', display: 1, space: 3 };

  assert({
    given: 'window already on the correct index',
    should: 'return empty array',
    actual: createWindowCommands({
      desiredWindowLayout: [
        [[testApp]]
      ],
      spacesPlan: [0]
    }),
    expected: []
  });

  assert({
    given: 'window on wrong position at first display',
    should: 'return yabai move command to the index of display',
    actual: createWindowCommands({
      desiredWindowLayout: [
        [[], [testApp]]
      ],
      spacesPlan: [0]
    }),
    expected: ['yabai -m window 1 --space 2']
  });

  assert({
    given: 'window desired for space on second display',
    should: 'return yabai move command with the absolute space index',
    actual: createWindowCommands({
      desiredWindowLayout: [
        [[], []], [[testApp]]
      ],
      spacesPlan: [0]
    }),
    expected: ['yabai -m window 1 --space 3']
  });

  assert({
    given: 'window on second display desired for space in first',
    should: 'return yabai move comand with lower index',
    actual: createWindowCommands({
      desiredWindowLayout: [
        [[], [testAppSpace3]]
      ],
      spacesPlan: [0]
    }),
    expected: ['yabai -m window 3 --space 2']
  });

  assert({
    given: 'window on correct space on second display when new space is created on first',
    should: 'not return a move command even though space index changes',
    actual: createWindowCommands({
      desiredWindowLayout: [
        [[], []],
        [[{ id: 1, app: 'TestApp', display: 2, space: 2 }]]
      ],
      spacesPlan: [1, 1]
    }),
    expected: []
  });

  assert({
    given: 'window on correct space on second display when new space is created on first',
    should: 'not return a move command even though space index changes',
    actual: createWindowCommands({
      desiredWindowLayout: [
        [[]],
        [[{ id: 1, app: 'TestApp', display: 2, space: 3 }]]
      ],
      spacesPlan: [-1, 0]
    }),
    expected: []
  });
});
