const assert = require('assert');
const { createFakeYabaiQuery } = require('../../helpers/createFakeYabaiQuery');
const path = require('path');
const { setupTestEnvironment } = require('../../helpers/setupTestEnvironment');
const { switchFocus } = require('../../../src/tasks/switchFocus');
const { assertThat, containsString, is, equalTo } = require('hamjest');

suite('yco switch-focus --name "App to Focus"', () => {
  test.only('focuses the window with yabai if window is on same space.', async () => {
    const windowsResult = [
      { app: 'App to Focus', display: 1, space: 1, id: 100, focused: 0 },
      { app: 'App in Focus', display: 2, space: 1, id: 200, focused: 1 }
    ];

    const spacesResult = [{ index: 1, focused: 1 }];

    const { executeYco, getYabaiLogs } = await setupTestEnvironment({
      configSourcePath: path.resolve(__dirname, '..', '..', 'fixtures', 'validateConfig', 'valid.yco.config.json'),
      defaultTarget: true
    });

    await executeYco('switch-focus --app "App to Focus"', { windowsResult, spacesResult });

    const yabaiLogs = await getYabaiLogs();
    assertThat(yabaiLogs, is(equalTo(['yabai -m window --focus 100'])));
  });

  test('focuses the window with yabai if window is on same space.', async () => {
    const windowsResult = [
      { app: 'App to Focus', display: 1, space: 1, id: 100, focused: 0 },
      { app: 'App in Focus', display: 2, space: 1, id: 200, focused: 1 }
    ];

    const spacesResult = [{ index: 1, focused: 1 }];

    let executedCommands = [];
    const yabaiAdapterMock = {
      query: createFakeYabaiQuery({ windowsResult, spacesResult }),
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

    const spacesResult = [{ index: 1, focused: 0 }, { index: 2, focused: 1 }];

    let executedCommands = [];
    const yabaiAdapterMock = {
      query: createFakeYabaiQuery({ windowsResult, spacesResult }),
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

    const spacesResult = [{ index: 1, focused: 1 }, { index: 2, focused: 0 }];

    let executedCommands = [];
    const yabaiAdapterMock = {
      query: createFakeYabaiQuery({ windowsResult, spacesResult }),
      apply: async (cmds) => {
        executedCommands = [...cmds];
      }
    };

    await switchFocus({ yabaiAdapter: yabaiAdapterMock, windowQuery: { app: 'App to Focus' } });
    assert.deepStrictEqual(executedCommands, ['yabai -m space --focus 2', 'yabai -m window --focus 300']);
  });
});
