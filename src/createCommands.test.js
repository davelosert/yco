import { describe } from 'riteway';
import { createSpaceCommands } from './createCommands'

describe('createSpaceCommands()', async assert => {
  const yabaiCreateSpace = 'yabai -m space --create';

  assert({
    given: 'no space to create',
    should: 'return an empty commands array',
    actual: createSpaceCommands({ spacesPlan: [0], spacesCount: [1] }),
    expected: [],
  });

  assert({
    given: 'one space to create on first display',
    should: 'return a single yabai create space command',
    actual: createSpaceCommands({ spacesPlan: [1], spacesCount: [1] }),
    expected: [yabaiCreateSpace],
  });

  assert({
    given: 'two spaces to create on first display',
    should: 'return two yabai create space commands',
    actual: createSpaceCommands({ spacesPlan: [2], spacesCount: [1] }),
    expected: [yabaiCreateSpace, yabaiCreateSpace],
  });

  assert({
    given: 'no space to create on first and second display',
    should: 'return an empty commands array',
    actual: createSpaceCommands({ spacesPlan: [0, 0], spacesCount: [1, 1] }),
    expected: []
  });

  assert({
    given: 'two spaces to create on second display',
    should: 'return a space create and move command with the index of the first display',
    actual: createSpaceCommands({ spacesPlan: [0, 2], spacesCount: [2, 1] }),
    expected: [yabaiCreateSpace, 'yabai -m space 3 --display 2', yabaiCreateSpace, 'yabai -m space 3 --display 2']
  });

  assert({
    given: 'one space to create on first and second display',
    should: 'return the move command with the calculated index',
    actual: createSpaceCommands({ spacesPlan: [1, 1], spacesCount: [2, 2] }),
    expected: [yabaiCreateSpace, yabaiCreateSpace, 'yabai -m space 4 --display 2']
  })

  assert({
    given: 'one space to delete on first display',
    should: 'return a single destroy command',
    actual: createSpaceCommands({ spacesPlan: [-1], spacesCount: [2] }),
    expected: ['yabai -m space 2 --destroy']
  });

  assert({
    given: 'two spaces to delete on first display',
    should: 'return two destroy commands',
    actual: createSpaceCommands({ spacesPlan: [-2], spacesCount: [3] }),
    expected: ['yabai -m space 3 --destroy', 'yabai -m space 2 --destroy']
  });

  assert({
    given: 'one space to create on first and two to delete on second display',
    should: 'return destroy commands with calculated max index',
    actual: createSpaceCommands({ spacesPlan: [1, -2], spacesCount: [2, 3] }),
    expected: [yabaiCreateSpace, 'yabai -m space 6 --destroy', 'yabai -m space 5 --destroy']
  });
});
