
const R = require('ramda');
const countByApp = R.countBy(R.prop('app'));
const countByValue = R.countBy(R.identity);


const getMissingWindows = (yabaiWindows, requiredWindows) => {
  const yabaiWithCount = countByApp(yabaiWindows);
  const requiredWithCount = R.pipe(
    countByValue,
    R.toPairs
  )(requiredWindows);

  return R.reduce((missingWindows, [app, requiredCount]) => {
    const openedCount = R.defaultTo(0, yabaiWithCount[app]);
    if (openedCount < requiredCount) {
      return R.append({
        app,
        times: requiredCount - openedCount
      },
        missingWindows
      );
    }

    return missingWindows;
  }, [])(requiredWithCount);
};

module.exports = {
  getMissingWindows
};
