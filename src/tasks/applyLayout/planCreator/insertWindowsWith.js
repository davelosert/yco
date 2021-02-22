const { hydrateWindows } = require('./hydrateWindows');
const R = require('ramda');

const insertWindowsWith = R.curry(
  (unmanagedStrategy, yabaiWindows, layouytPlan) => {
    const { remainingWindows, layoutPlan } = hydrateWindows(yabaiWindows, layouytPlan);
    return unmanagedStrategy(remainingWindows, layoutPlan);
  });

module.exports = {
  insertWindowsWith
};
