const path = require('path');
const { setupTestEnvironment } = require('../../helpers/setupTestEnvironment');
const { assertThat, isEmpty, is, equalTo } = require('hamjest');

suite('yco apply-layout --name "Layout To apply"', () => {
  test('executes yabai commands to move windows to their configured spaces and creates those spaces if necessary.', async () => {
    const windowsResult = [
      { app: 'iTerm2', display: 1, space: 1, id: 100, focused: 0 },
      { app: 'Code', display: 1, space: 1, id: 200, focused: 0 },
      { app: 'Firefox', display: 1, space: 1, id: 300, focused: 1 }
    ];

    const spacesResult = [{ index: 1, focused: 1, windows: [100, 200, 300] }];

    const { executeYco, getYabaiLogs } = await setupTestEnvironment({
      configSourcePath: path.resolve(__dirname, '..', '..', 'fixtures', 'valid.yco.config.json'),
      defaultTarget: true
    });

    await executeYco('apply-layout --name laptop', { windowsResult, spacesResult });

    const yabaiLogs = await getYabaiLogs();

    assertThat(yabaiLogs, is(equalTo([
      'yabai -m display --focus 1',
      'yabai -m space --create',
      'yabai -m space --create',
      'yabai -m window 200 --space 2',
      'yabai -m window 300 --space 3'
    ])));
  });

  test('executes no commands if all windows are already in their correct position.', async () => {
    const windowsResult = [
      { app: 'iTerm2', display: 1, space: 1, id: 100, focused: 0 },
      { app: 'Code', display: 1, space: 1, id: 200, focused: 0 },
      { app: 'Firefox', display: 1, space: 1, id: 300, focused: 1 }
    ];

    const spacesResult = [{ index: 1, focused: 1, windows: [100, 200, 300] }];

    const { executeYco, getYabaiLogs } = await setupTestEnvironment({
      configSourcePath: path.resolve(__dirname, '..', '..', 'fixtures', 'valid.yco.config.json'),
      defaultTarget: true
    });

    await executeYco('apply-layout --name monitor', { windowsResult, spacesResult });

    const yabaiLogs = await getYabaiLogs();

    assertThat(yabaiLogs, isEmpty());
  });

  test('execute yabai commands to remove empty spaces (if it is not the last space on a display)', async () => {
    const windowsResult = [
      { app: 'iTerm2', display: 1, space: 1, id: 100, focused: 0 },
      { app: 'Code', display: 1, space: 2, id: 200, focused: 0 },
      { app: 'Firefox', display: 2, space: 4, id: 300, focused: 1 }
    ];

    const spacesResult = [
      { display: 1, index: 1, focused: 0, windows: [100] },
      { display: 1, index: 2, focused: 0, windows: [200] },
      { display: 2, index: 3, focused: 1, windows: [] },
      { display: 2, index: 4, focused: 1, windows: [300] }
    ];

    const { executeYco, getYabaiLogs } = await setupTestEnvironment({
      configSourcePath: path.resolve(__dirname, '..', '..', 'fixtures', 'valid.yco.config.json'),
      defaultTarget: true
    });

    await executeYco('apply-layout --name monitor', { windowsResult, spacesResult });

    const yabaiLogs = await getYabaiLogs();

    assertThat(yabaiLogs, is(equalTo([
      'yabai -m space 2 --destroy',
      'yabai -m space 3 --destroy',
      'yabai -m window 200 --space 1',
      'yabai -m window 300 --space 1'
    ])));
  });

  test('with option { "nonManaged": "allInOneSpace" } executes commands to move unmanaged windows to last space on main display.', async () => {
    const windowsResult = [
      { app: 'iTerm2', display: 1, space: 1, id: 100, focused: 0 },
      { app: 'Code', display: 1, space: 1, id: 200, focused: 0 },
      { app: 'Firefox', display: 1, space: 1, id: 300, focused: 1 },
      { app: 'Unmanaged Window 1', display: 1, space: 1, id: 101, focused: 0 },
      { app: 'Unmanaged Window 2', display: 2, space: 2, id: 201, focsed: 0 }
    ];

    const spacesResult = [
      { display: 1, index: 1, windows: [100, 200, 300, 101] },
      { display: 2, index: 2, windows: [201] },
    ];

    const { executeYco, getYabaiLogs } = await setupTestEnvironment({
      configSourcePath: path.resolve(__dirname, '..', '..', 'fixtures', 'valid.yco.config.json'),
      defaultTarget: true
    });

    await executeYco('apply-layout --name monitor', { windowsResult, spacesResult });

    const yabaiLogs = await getYabaiLogs();

    assertThat(yabaiLogs, is(equalTo([
      'yabai -m display --focus 1',
      'yabai -m space --create',
      'yabai -m window 101 --space 2',
      'yabai -m window 201 --space 2'
    ])));
  });

  test('with option { "nonManaged": "allInOwnSpace" } executes commands to move each unmanaged window into an own space on the main display.', async () => {
    const windowsResult = [
      { app: 'iTerm2', display: 1, space: 1, id: 100, focused: 0 },
      { app: 'Unmanaged Window 1', display: 1, space: 1, id: 101, focused: 0 },
      { app: 'Code', display: 1, space: 2, id: 200, focused: 0 },
      { app: 'Firefox', display: 1, space: 3, id: 300, focused: 1 },
      { app: 'Unmanaged Window 2', display: 2, space: 4, id: 201, focsed: 0 }
    ];

    const spacesResult = [
      { display: 1, index: 1, windows: [100, 101] },
      { display: 1, index: 2, windows: [200] },
      { display: 1, index: 3, windows: [300] },
      { display: 2, index: 4, windows: [201] },
    ];

    const { executeYco, getYabaiLogs } = await setupTestEnvironment({
      configSourcePath: path.resolve(__dirname, '..', '..', 'fixtures', 'valid.yco.config.json'),
      defaultTarget: true
    });

    await executeYco('apply-layout --name laptop', { windowsResult, spacesResult });

    const yabaiLogs = await getYabaiLogs();

    assertThat(yabaiLogs, is(equalTo([
      'yabai -m display --focus 1',
      'yabai -m space --create',
      'yabai -m space --create',
      'yabai -m window 101 --space 4',
      'yabai -m window 201 --space 5'
    ])));
  });

  test('with option { "nonManaged": "leaveUntouched" } leaves all unmanaged windows where they are, but moves their spaces behind managed windows spaces.', async () => {
    const windowsResult = [
      { app: 'iTerm2', display: 1, space: 1, id: 100, focused: 0 },
      { app: 'Unmanaged Window 1', display: 1, space: 1, id: 101, focused: 0 },
      { app: 'Code', display: 1, space: 2, id: 200, focused: 0 },
      { app: 'Firefox', display: 1, space: 3, id: 300, focused: 1 },
      { app: 'Unmanaged Window 2', display: 2, space: 4, id: 201, focsed: 0 }
    ];

    const spacesResult = [
      { display: 1, index: 1, windows: [100, 101] },
      { display: 1, index: 2, windows: [200] },
      { display: 1, index: 3, windows: [300] },
      { display: 2, index: 4, windows: [201] },
    ];

    const { executeYco, getYabaiLogs } = await setupTestEnvironment({
      configSourcePath: path.resolve(__dirname, '..', '..', 'fixtures', 'valid.yco.config.json'),
      defaultTarget: true
    });

    await executeYco('apply-layout --name pairing', { windowsResult, spacesResult });

    const yabaiLogs = await getYabaiLogs();

    assertThat(yabaiLogs, is(equalTo([
      'yabai -m space 3 --destroy',
      'yabai -m space 2 --destroy',
      'yabai -m display --focus 2',
      'yabai -m space --create',
      'yabai -m space --create',
      'yabai -m space --create',
      'yabai -m window 100 --space 2',
      'yabai -m window 200 --space 3',
      'yabai -m window 300 --space 4',
      'yabai -m window 201 --space 5',
    ])));
  });


});
