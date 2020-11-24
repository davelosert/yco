import { describe } from 'riteway';
import { createWindowCommands } from './createWindowCommands';

describe('createWindowComands()', async assert => {
  const testApp = { id: 1, app: 'TestApp', display: 1, space: 1 };
  const testAppSpace3 = { id: 3, app: 'TestApp', display: 1, space: 3 };

  assert({
    given: 'window already on the correct index',
    should: 'return empty array',
    actual: createWindowCommands([[[testApp]]]),
    expected: []
  });

  assert({
    given: 'window on wrong position at first display',
    should: 'return yabai move command to the index of display',
    actual: createWindowCommands([[[], [testApp]]]),
    expected: ['yabai -m window 1 --space 2']
  });

  assert({
    given: 'window desired for space on second display',
    should: 'return yabai move command with the absolte space index',
    actual: createWindowCommands([[[], []], [[testApp]]]),
    expected: ['yabai -m window 1 --space 3']
  });

  assert({
    given: 'window on second display desired for space in first',
    should: 'return yabai move comand with lower index',
    actual: createWindowCommands([[[], [testAppSpace3]]]),
    expected: ['yabai -m window 3 --space 2']
  });
});
