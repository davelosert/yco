const path = require('path');
const { setupTestEnvironment } = require('../../helpers/setupTestEnvironment');
const { assertThat, isEmpty, is, equalTo, containsString } = require('hamjest');
const { withoutIndentSpaces } = require('../../helpers/withoutIndentSpaces');

suite('yco apply-layout --name "Layout To apply"', () => {
  test('executes yabai commands to move windows to their configured spaces and creates those spaces if necessary.', async () => {
    const windowsResult = [
      { app: 'iTerm2', display: 1, space: 1, id: 100, focused: 0 },
      { app: 'Code', display: 1, space: 1, id: 200, focused: 0 },
      { app: 'Firefox', display: 1, space: 1, id: 300, focused: 1 }
    ];

    const spacesResult = [{ index: 1, display: 1, focused: 1, windows: [100, 200, 300] }];

    const { executeYco, getYabaiLogs } = await setupTestEnvironment({
      configSourcePath: path.resolve(__dirname, '..', '..', 'fixtures', 'layout.yco.config.json'),
      defaultTarget: true
    });

    const { output } = await executeYco('apply-layout --name onlyMoveWindowsTest', { windowsResult, spacesResult });

    const yabaiLogs = await getYabaiLogs();

    assertThat(output, isEmpty());
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
      { app: 'Code', display: 1, space: 2, id: 200, focused: 0 },
      { app: 'Firefox', display: 1, space: 3, id: 300, focused: 1 }
    ];

    const spacesResult = [
      { index: 1, focused: 1, windows: [100] },
      { index: 2, focused: 0, windows: [200] },
      { index: 3, focused: 0, windows: [300] }
    ];

    const { executeYco, getYabaiLogs } = await setupTestEnvironment({
      configSourcePath: path.resolve(__dirname, '..', '..', 'fixtures', 'layout.yco.config.json'),
      defaultTarget: true
    });

    const { output } = await executeYco('apply-layout --name onlyMoveWindowsTest', { windowsResult, spacesResult });

    const yabaiLogs = await getYabaiLogs();

    assertThat(output, isEmpty());
    assertThat(yabaiLogs, isEmpty());
  });

  test('executes yabai commands to construct the desired window trees on all displays.', async () => {
    const windowsResult = [
      { app: 'iTerm2', display: 1, space: 2, id: 100, focused: 0 },
      { app: 'iTerm2', display: 1, space: 1, id: 101, focused: 0 },
      { app: 'Code', display: 1, space: 1, id: 200, focused: 0 },
      { app: 'Firefox', display: 1, space: 1, id: 300, focused: 1 },
      { app: 'Chrome', display: 1, space: 2, id: 400, focused: 0 }
    ];

    const spacesResult = [
      { display: 1, index: 1, focused: 1, windows: [101, 200, 300] },
      { display: 1, index: 2, focused: 0, windows: [100, 400] },
    ];

    const { executeYco, getYabaiLogs } = await setupTestEnvironment({
      configSourcePath: path.resolve(__dirname, '..', '..', 'fixtures', 'layout.yco.config.json'),
      defaultTarget: true
    });

    const { output } = await executeYco('apply-layout --name treeNodeTest', { windowsResult, spacesResult });

    const yabaiLogs = await getYabaiLogs();


    assertThat(output, isEmpty());
    assertThat(yabaiLogs, is(equalTo([
      'yabai -m window 100 --space 1',
      'yabai -m window 100 --insert east',
      'yabai -m window 200 --warp 100',
      'yabai -m window 200 --insert east',
      'yabai -m window 300 --warp 200',
      'yabai -m window 100 --insert south',
      'yabai -m window 101 --warp 100'
    ])));
  });

  test('executes yabai commands to remove empty spaces (if it is not the last space on a display) in the end.', async () => {
    const windowsResult = [
      { app: 'Display1Space1', display: 1, space: 1, id: 100, focused: 0 },
      { app: 'Display1Space2', display: 2, space: 4, id: 200, focused: 0 },
      { app: 'Display2Space3', display: 1, space: 2, id: 300, focused: 1 },
    ];

    const spacesResult = [
      { display: 1, index: 1, focused: 0, windows: [100] },
      { display: 2, index: 2, focused: 0, windows: [300] },
      { display: 2, index: 3, focused: 0, windows: [] },
      { display: 2, index: 4, focused: 1, windows: [200] }
    ];

    const { executeYco, getYabaiLogs } = await setupTestEnvironment({
      configSourcePath: path.resolve(__dirname, '..', '..', 'fixtures', 'layout.yco.config.json'),
      defaultTarget: true
    });

    const { output } = await executeYco('apply-layout --name destroySpacesTest', { windowsResult, spacesResult });

    const yabaiLogs = await getYabaiLogs();

    assertThat(output, isEmpty());
    assertThat(yabaiLogs, is(equalTo([
      'yabai -m display --focus 1',
      'yabai -m space --create',
      'yabai -m window 200 --space 2',
      'yabai -m window 300 --space 3',
      'yabai -m space 5 --destroy',
      'yabai -m space 4 --destroy',
    ])));
  });

  test('opens all missing apps and windows of a given layout before applying the layout.', async function () {
    this.timeout(5000);

    const windowsResultFirstCall = [
      { app: 'Already Open', display: 1, space: 1, id: 100, focused: 0 },
    ];
    const windowResultSecondCall = [
      ...windowsResultFirstCall,
      { app: 'Not Open Yet', display: 1, space: 2, id: 200 }
    ];

    const windowResultFinalCall = [
      ...windowResultSecondCall,
      { app: 'Not Open Yet', display: 1, space: 2, id: 300 }
    ];

    const windowsResult = [
      windowsResultFirstCall,
      windowResultSecondCall,
      windowResultFinalCall,
      // Needs to be inserted twice as it is called both by the open and by apply-layout
      windowResultFinalCall
    ];

    const spacesResult = [
      { display: 1, index: 1, focused: 0, windows: [100] },
      { display: 1, index: 2, focused: 1, windows: [200, 300] },
      { display: 1, index: 3, focused: 0, windows: [] },
    ];

    const { executeYco, getYabaiLogs, getOpenLogs } = await setupTestEnvironment({
      configSourcePath: path.resolve(__dirname, '..', '..', 'fixtures', 'layout.yco.config.json'),
      defaultTarget: true
    });

    const { output } = await executeYco('apply-layout --name openWindowsTest', { windowsResult, spacesResult });

    const yabaiLogs = await getYabaiLogs();
    const openLogs = await getOpenLogs();


    assertThat(output, isEmpty());
    assertThat(openLogs, is(equalTo([
      'open -n -g -a Not Open Yet',
      'open -n -g -a Not Open Yet'
    ])));
    assertThat(yabaiLogs, is(equalTo([
      'yabai -m window 300 --space 3',
    ])));
  });

  test('with option "layoutModeBinaryMap" to open apps with their mapped binary name.', async function () {
    this.timeout(5000);

    const windowsResultFirstCall = [];
    const windowResultFinalCall = [{ app: 'mappedAppName', display: 1, space: 1, id: 100 }];

    const windowsResult = [windowsResultFirstCall,
      windowResultFinalCall,
      // Needs to be inserted twice as it is called both by the open and by apply-layout
      windowResultFinalCall
    ];

    const spacesResult = [{ display: 1, index: 1, focused: 1, windows: [100] },];

    const { executeYco, getOpenLogs } = await setupTestEnvironment({
      configSourcePath: path.resolve(__dirname, '..', '..', 'fixtures', 'layout.yco.config.json'),
      defaultTarget: true
    });

    const { output } = await executeYco('apply-layout --name mapBinaryTest', { windowsResult, spacesResult });

    const openLogs = await getOpenLogs();
    assertThat(output, isEmpty());
    assertThat(openLogs, is(equalTo([
      'open -n -g -a mappedBinaryName',
    ])));
  });

  test('with option "layoutModeIgnoreWindows" ignores all specified windows by app or by title', async function () {
    const windowsResult = [
      { app: 'Managed App', display: 1, space: 1, id: 100, focused: 0 },
      { app: 'Ignored App', display: 1, space: 1, id: 200, focused: 0 },
      { app: 'Nonignored App', display: 1, space: 1, id: 300, focused: 0 },
      { app: 'Nonignored App', title: 'butWithIgnoredTitle', display: 1, space: 1, id: 400, focused: 0 },
    ];

    const spacesResult = [{ display: 1, index: 1, focused: 1, windows: [100, 200, 300, 400] },];

    const { executeYco, getYabaiLogs } = await setupTestEnvironment({
      configSourcePath: path.resolve(__dirname, '..', '..', 'fixtures', 'layout.yco.config.json'),
      defaultTarget: true
    });

    const { output } = await executeYco('apply-layout --name ignoreWindowsTest', { windowsResult, spacesResult });

    const yabaiLogs = await getYabaiLogs();
    assertThat(output, isEmpty());
    assertThat(yabaiLogs, is(equalTo([
      'yabai -m display --focus 1',
      'yabai -m space --create',
      'yabai -m window 300 --space 2'
    ])));
  });

  test('with option \'{ "nonManaged": "allInOneSpace" }\' executes commands to move unmanaged windows to last space on the main display.', async () => {
    const windowsResult = [
      { app: 'Managed 1', display: 1, space: 1, id: 100, focused: 0 },
      { app: 'Managed 2', display: 1, space: 1, id: 200, focused: 0 },
      { app: 'Unmanaged 1', display: 1, space: 1, id: 300, focused: 0 },
      { app: 'Unmanaged 2', display: 2, space: 2, id: 301, focsed: 0 }
    ];

    const spacesResult = [
      { display: 1, index: 1, windows: [100, 200, 300] },
      { display: 2, index: 2, windows: [301] },
    ];

    const { executeYco, getYabaiLogs } = await setupTestEnvironment({
      configSourcePath: path.resolve(__dirname, '..', '..', 'fixtures', 'layout.yco.config.json'),
      defaultTarget: true
    });

    const { output } = await executeYco('apply-layout --name allInOneSpaceTest', { windowsResult, spacesResult });

    const yabaiLogs = await getYabaiLogs();

    assertThat(output, isEmpty());
    assertThat(yabaiLogs, is(equalTo([
      'yabai -m display --focus 1',
      'yabai -m space --create',
      'yabai -m space --create',
      'yabai -m window 200 --space 2',
      'yabai -m window 300 --space 3',
      'yabai -m window 300 --insert east',
      'yabai -m window 301 --warp 300'
    ])));
  });

  test('with option \'{ "nonManaged": "allInOwnSpace" }\' executes commands to move each unmanaged window into an own space on the main display.', async () => {
    const windowsResult = [
      { app: 'Managed 1', display: 1, space: 1, id: 100, focused: 0 },
      { app: 'Unmanaged 1', display: 1, space: 1, id: 300, focused: 0 },
      { app: 'Managed 2', display: 1, space: 2, id: 200, focused: 0 },
      { app: 'Unmanaged 2', display: 2, space: 3, id: 400, focsed: 0 }
    ];

    const spacesResult = [
      { display: 1, index: 1, windows: [100, 300] },
      { display: 1, index: 2, windows: [200] },
      { display: 2, index: 3, windows: [400] },
    ];

    const { executeYco, getYabaiLogs } = await setupTestEnvironment({
      configSourcePath: path.resolve(__dirname, '..', '..', 'fixtures', 'layout.yco.config.json'),
      defaultTarget: true
    });

    const { output } = await executeYco('apply-layout --name allInOwnSpaceTest', { windowsResult, spacesResult });

    const yabaiLogs = await getYabaiLogs();

    assertThat(output, isEmpty());
    assertThat(yabaiLogs, is(equalTo([
      'yabai -m display --focus 1',
      'yabai -m space --create',
      'yabai -m space --create',
      'yabai -m window 300 --space 3',
      'yabai -m window 400 --space 4'
    ])));
  });

  test('with option \'{ "nonManaged": "leaveUntouched" }\' leaves all unmanaged windows where they are, but moves their spaces behind existing managed windows\' spaces.', async () => {
    const windowsResult = [
      { app: 'Managed 1', display: 1, space: 3, id: 100 },
      { app: 'Unmanaged 1', display: 1, space: 1, id: 300 },
      { app: 'Managed 2', display: 1, space: 2, id: 200 },
      { app: 'Unmanaged 2', display: 1, space: 4, id: 400 },
      { app: 'Managed 3', display: 1, space: 5, id: 500 },
      { app: 'Unmanaged 3', display: 2, space: 5, id: 600 },
      { app: 'Unmanaged 4', display: 2, space: 5, id: 601 }
    ];

    const spacesResult = [
      { display: 1, index: 1, windows: [300] },
      { display: 1, index: 2, windows: [200] },
      { display: 1, index: 3, windows: [100] },
      { display: 1, index: 4, windows: [400] },
      { display: 1, index: 5, windows: [500] },
      { display: 2, index: 6, windows: [600, 601] }
    ];

    const { executeYco, getYabaiLogs } = await setupTestEnvironment({
      configSourcePath: path.resolve(__dirname, '..', '..', 'fixtures', 'layout.yco.config.json'),
      defaultTarget: true
    });

    const { output } = await executeYco('apply-layout --name leaveUntouchedTest', { windowsResult, spacesResult });

    const yabaiLogs = await getYabaiLogs();

    assertThat(output, isEmpty());
    assertThat(yabaiLogs, is(equalTo([
      'yabai -m display --focus 2',
      'yabai -m space --create',
      'yabai -m space 1 --swap 3',
      'yabai -m space 6 --swap 7',
      'yabai -m window 500 --space 6',
      'yabai -m space 5 --destroy',
    ])));
  });

  suite('with "--debug"', () => {
    test('only prints all commands to stdout without executing them.', async () => {
      const windowsResult = [
        { app: 'iTerm2', display: 1, space: 1, id: 100, focused: 0 },
        { app: 'Code', display: 1, space: 1, id: 200, focused: 0 },
        { app: 'Firefox', display: 1, space: 1, id: 300, focused: 1 }
      ];

      const spacesResult = [{ index: 1, focused: 1, windows: [100, 200, 300] }];

      const { executeYco, getYabaiLogs } = await setupTestEnvironment({
        configSourcePath: path.resolve(__dirname, '..', '..', 'fixtures', 'layout.yco.config.json'),
        defaultTarget: true
      });

      const { output } = await executeYco('apply-layout --name onlyMoveWindowsTest --debug', { windowsResult, spacesResult });

      const yabaiLogs = await getYabaiLogs();

      assertThat(yabaiLogs, isEmpty());
      assertThat(
        withoutIndentSpaces(output),
        containsString(withoutIndentSpaces(`
          The following commands would have been executed:
          ∙ yabai -m display --focus 1
          ∙ yabai -m space --create
          ∙ yabai -m space --create
          ∙ yabai -m window 200 --space 2
          ∙ yabai -m window 300 --space 3
        `)
        ));
    });
  });
});
