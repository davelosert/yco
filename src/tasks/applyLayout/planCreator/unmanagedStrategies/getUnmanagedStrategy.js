const { allInOneSpace } = require('./allInOneSpace');
const { allInOwnSpace } = require('./allInOwnSpace');
const { leaveUntouched } = require('./leaveUntouched');

const strategies = {
  allInOneSpace,
  allInOwnSpace,
  leaveUntouched
};

const getUnmanagedStrategy = (descriptor) => {
  const strategy = strategies[descriptor];

  if (!strategy) {
    throw new Error(`Unmanaged-Strategy ${descriptor} does not exist. Is your config correct?`);
  }

  return strategy;
};

module.exports = {
  getUnmanagedStrategy
};
