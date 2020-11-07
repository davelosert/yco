import { test } from 'ramda';
import { describe } from 'riteway';
import { createWindowCommands } from './createWindowCommands';

describe.skip('createWindowCommands()', async assert => {
  const testApp = { id: 1, title: "TestApp", display: 1, space: 1 };

  assert({
    given: 'no window to move',
    should: 'return empty array',
    actual: createWindowCommands([[[]]]),
    expected: []
  });

  assert({
    given: 'window on first space thats planned for the second space',
    should: 'return move command for that window',
    actual: createWindowCommands([[[], [{...testApp}]]]),
    expected: ['yabai -m window 1 --space 2']
  });

  assert({
    given: 'window that is in the right place',
    should: 'return empty array',
    actual: createWindowCommands([[[{...testApp}]]]),
    expected: []
  });


});
