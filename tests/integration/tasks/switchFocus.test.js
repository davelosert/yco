const { allWindows } = require('../../../src/shared/yabaiCommands');
const { switchFocus } = require('../../../src/tasks/switchFocus');
const assert = require('assert');

suite('task: switchFocus()', () => {
  const createFakeYabaiQuery = (windowsResult) => {
    return async (cmd) => {
      if (cmd === allWindows()) {
        return windowsResult;
      }
    };
  };

  test('focuses queried window if not focused but on same space', async () => {
    const windowsResult = [
      { app: 'App to Focus', display: 1, space: 1, id: 100, focused: 0 },
      { app: 'App in Focus', display: 2, space: 1, id: 200, focused: 1 }
    ];

    let executedCommands = [];
    const yabaiAdapterMock = {
      query: createFakeYabaiQuery(windowsResult),
      apply: async (cmds) => {
        executedCommands = [
          ...executedCommands,
          ...cmds
        ];
      }
    };

    await switchFocus({
      yabaiAdapter: yabaiAdapterMock,
      windowQuery: { app: 'App to Focus' }
    });

    assert.deepStrictEqual(executedCommands, [
      'yabai -m window --focus 100'
    ]);
  });

  test('focuses queried space and window if both are not focused yet', async () => {
    const windowsResult = [
      { app: 'App to Focus', display: 1, space: 1, id: 100, focused: 0 },
      { app: 'App in Focus', display: 2, space: 2, id: 200, focused: 1 }
    ];

    let executedCommands = [];
    const yabaiAdapterMock = {
      query: createFakeYabaiQuery(windowsResult),
      apply: async (cmds) => {
        executedCommands = [
          ...executedCommands,
          ...cmds
        ];
      }
    };

    await switchFocus({
      yabaiAdapter: yabaiAdapterMock,
      windowQuery: { app: 'App to Focus' }
    });

    assert.deepStrictEqual(executedCommands, [
      'yabai -m space --focus 1',
      'yabai -m window --focus 100'
    ]);
  });


  test('fouses next window of an app with multiple windows if one is already focused', async () => {
    const windowsResult = [
      { app: 'App to Focus', display: 1, space: 1, id: 100, focused: 0 },
      { app: 'App to Focus', display: 1, space: 1, id: 200, focused: 1 },
      { app: 'App to Focus', display: 1, space: 2, id: 300, focused: 0 },
    ];

    let executedCommands = [];
    const yabaiAdapterMock = {
      query: createFakeYabaiQuery(windowsResult),
      apply: async (cmds) => {
        executedCommands = [...cmds];
      }
    };

    await switchFocus({ yabaiAdapter: yabaiAdapterMock, windowQuery: { app: 'App to Focus' } });
    assert.deepStrictEqual(executedCommands, ['yabai -m space --focus 2', 'yabai -m window --focus 300']);
  });
});
