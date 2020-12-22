import assert from 'assert';
import { applyLayout } from '../../../src/tasks/applyLayout';
import { allSpaces, allWindows } from '../../../src/shared/yabaiComands';

suite('task: applyLayout()', () => {
  const createFakeYabaiQuery = ({ spacesResult, windowsResult }) => {
    return async (cmd) => {
      if (cmd === allSpaces()) {
        return spacesResult;
      }

      if (cmd === allWindows()) {
        return windowsResult;
      }
    };
  };

  test('executes no command if all windows are already in their correct position', async () => {
    const layoutConfig = {
      nonManaged: 'allInOwnSpace',
      spaces: [[
        ['OnlyApp']
      ]]
    };

    const spacesResult = [{ display: 1, index: 1, windows: [100] }];
    const windowsResult = [{ app: 'OnlyApp', display: 1, space: 1, id: 100 }];

    const yabaiAdapterMock = {
      query: createFakeYabaiQuery({ spacesResult, windowsResult }),
      apply: async (cmds) => {
        assert.deepStrictEqual(cmds, []);
      }
    };

    await applyLayout({
      layoutConfig,
      yabaiAdapter: yabaiAdapterMock
    });
  });

  test('executes only necessary commands to create spaces and move windows', async () => {
    const layoutConfig = {
      nonManaged: 'allInOwnSpace',
      spaces: [[
        ['To Space 1'], ['To Space 2'], ['To Space 3']
      ]]
    };

    const windowsResult = [
      { app: 'To Space 1', display: 1, space: 1, id: 100 },
      { app: 'To Space 2', display: 1, space: 2, id: 200 },
      { app: 'To Space 3', display: 1, space: 1, id: 300 },
    ];

    const spacesResult = [
      { display: 1, index: 1, windows: [100, 300] },
      { display: 1, index: 2, windows: [200] },
    ];

    const yabaiAdapterMock = {
      query: createFakeYabaiQuery({ windowsResult, spacesResult }),
      apply: async (cmds) => {
        assert.deepStrictEqual(cmds, [
          'yabai -m display --focus 1',
          'yabai -m space --create',
          'yabai -m window 300 --space 3'
        ]);
      }
    };

    await applyLayout({
      layoutConfig,
      yabaiAdapter: yabaiAdapterMock
    });
  });
});
