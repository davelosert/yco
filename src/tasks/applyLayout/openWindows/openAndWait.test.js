const { describe } = require('riteway');
const { createLayoutConfig } = require('../domain/LayoutConfig');
const { openAndWait } = require('./openAndWait');
const { wait } = require('../../../shared/wait');

describe('openAndWait(yabaiAdapter: YabaiAdapter, layoutConfig: LayoutConfig): Promise<void>', async assert => {
  const timeoutOpts = {
    waitFor: 3,
    timeoutAfter: 500
  };
  const yabaiAdapterReturn = windowsPerCall => {
    let callCount = 0;
    return {
      query: () => {
        return windowsPerCall[callCount++];
      },
      getCallCount: () => callCount
    };
  };

  const createParallellExec = () => {
    let passedCmds = [];
    const func = cmds => {
      passedCmds = cmds;
      return new Promise(resolve => resolve());
    };
    func.getPassedCmds = () => passedCmds;
    return func;
  };

  const layoutConfigWithApps = apps => createLayoutConfig({
    spaces: [[apps]]
  });


  let resolved = false;
  openAndWait(
    yabaiAdapterReturn([[{ app: 'Only App', id: 1 }]]),
    createParallellExec,
    timeoutOpts,
    layoutConfigWithApps(['Only App'])
  ).then(() => resolved = true);

  await wait(1);

  assert({
    given: 'no missing windows',
    should: 'resolve immidiately',
    actual: resolved,
    expected: true
  });

  resolved = false;

  let parallellExec = createParallellExec();
  openAndWait(
    yabaiAdapterReturn([[], [{ app: 'Only App', id: 1 }]]),
    parallellExec,
    timeoutOpts,
    layoutConfigWithApps(['Only App'])
  ).then(() => resolved = true);

  assert({
    given: 'one missing window',
    should: 'not resolve but wait for window to open',
    actual: resolved,
    expected: false
  });

  await wait(1);
  assert({
    given: 'one missing window',
    should: 'execute command to open the window',
    actual: parallellExec.getPassedCmds(),
    expected: ['open -n -g -a "Only App"']
  });

  await wait(4);
  assert({
    given: 'one missing window',
    should: 'resolve after the window was opened',
    actual: resolved,
    expected: true
  });


  let rejectedErr = false;
  openAndWait(
    yabaiAdapterReturn([[], [], []]),
    createParallellExec(),
    {
      waitFor: 3,
      timeoutAfter: 5
    },
    layoutConfigWithApps(['Only App'])
  ).catch((err) => rejectedErr = err);

  await wait(6);

  assert({
    given: 'missing window doesnt open within configured timeout',
    should: 'throw error',
    actual: rejectedErr,
    expected: new Error('Opening windows took too long.')
  });



});
