const { describe } = require('riteway');
const { createParallelExec } = require('./createParalellExec');
const { wait } = require('./wait');


describe('paralelleExec(cmdExec): Promise<void>', async assert => {
  let executedCommands = [];
  const stubExec = async (cmd) => {
    executedCommands.push(cmd);
    return wait(2);
  };

  const parallelExec = createParallelExec(stubExec);

  const givenCommands = ['Cmd1', 'Cmd2'];
  const execPromise = parallelExec(givenCommands);

  assert({
    given: 'two commands',
    should: 'execute them both in parallel before either was resolved',
    actual: executedCommands,
    expected: givenCommands
  });

  let isResolved = false;
  execPromise.then(() => isResolved = true);

  assert({
    given: 'two commands',
    should: 'do not resolve until both commands are resolved',
    actual: isResolved,
    expected: false
  });

  await wait(3);

  assert({
    given: 'two commands',
    should: 'resolve once both commands have returned',
    actual: isResolved,
    expected: true
  });



});
