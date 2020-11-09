import { describe } from 'riteway';
import { planSpaces } from './planSpaces';

describe('planSpaces()', async assert => {
  assert({
    given: 'one space exists on a single screen and only one is needed',
    should: 'return 0 for that display',
    actual: planSpaces({ currentSpaces: [{ display: 1 }], desiredSpaces: [['ExampleApp']] }),
    expected: [0]
  });

  assert({
    given: 'one space exists on a single screen and two are needed',
    should: 'return 1 for that display',
    actual: planSpaces({ currentSpaces: [{ display: 1 }], desiredSpaces: [[['TestApp1'], ['TestApp2']]] }),
    expected: [1]
  });

  assert({
    given: 'three spaces exist on a single screen but only one is needed',
    should: 'return -2 for that display',
    actual: planSpaces({ currentSpaces: [{ display: 1 }, { display: 1 }, { display: 1 }], desiredSpaces: [[['TestApp1']]] }),
    expected: [-2]
  });

  assert({
    given: 'one space on the display but no app is given',
    should: 'keep the only space as it is not deletable',
    actual: planSpaces({ currentSpaces: [{ display: 1 }], desiredSpaces: [[]] }),
    expected: [0]
  });

  assert({
    given: 'one space exists on the second screen but three are needed',
    should: 'return three for that second display',
    actual: planSpaces({ currentSpaces: [{ display: 1 }, { display: 2 }], desiredSpaces: [[], [['App1'], ['App2'], ['App3']]] }),
    expected: [0, 2]
  });


});
