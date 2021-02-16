const { createWindowTree } = require('./WindowTree');
const { describe } = require('riteway');
const { moveFirstWindow } = require('./moveFirstWindows');

describe('moveFirstWindow()', async assert => {
  const firstWindow = createWindowTree({
    type: 'window',
    app: 'test',
    id: 1,
    space: 1,
    display: 1
  });

  const aSpaceWith = (windowTree) => ({
    display: 1,
    index: 1,
    windowTree: {
      ...windowTree
    }
  });

  assert({
    given: 'a space with a window on the target space',
    should: 'return an empty array',
    actual: moveFirstWindow([aSpaceWith(firstWindow)]),
    expected: []
  });

  assert({
    given: 'a space with a window on another space on the same display',
    should: 'return yabai command to move the window to the given space',
    actual: moveFirstWindow([aSpaceWith({ ...firstWindow, space: 2 })]),
    expected: ['yabai -m window 1 --space 1']
  });
});
