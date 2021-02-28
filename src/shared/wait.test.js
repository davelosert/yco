const { describe } = require('riteway');
const { wait } = require('./wait');

describe('wait(ms: Seconds) => Promise<void>', async assert => {
  let wasCalled = false;
  setTimeout(() => {
    wasCalled = true;
  }, 2);

  await wait(5);

  assert({
    given: 'a call to wait with 5 ms delay',
    should: 'wait that time and not execute something before',
    actual: wasCalled,
    expected: true
  });

  let timeoutRan = false;
  const failureId = setTimeout(() => {
    timeoutRan = true;
  }, 10);
  await wait(5);
  clearTimeout(failureId);

  assert({
    given: 'a call to waith with 5 ms delay',
    should: 'resolve after the given time',
    actual: timeoutRan,
    expected: false
  });

});
