const R = require('ramda');

const defaultLayoutConfig = {
  'name': 'default',
  'triggerKey': 'd',
  'nonManaged': 'leaveUntouched',
  'spaces': [[]]
};

const createLayoutConfig = ({ spaces }) => ({
  ...defaultLayoutConfig,
  spaces
});

const getWindowsFlat = layoutConfig => R.flatten(layoutConfig.spaces);

const isSplit = R.has('split');
const isString = R.is(String);

const getWindowsAsString = windowDescriptors => windowDescriptors.flatMap(
  windowDescriptor => {
    if (isString(windowDescriptor)) return [windowDescriptor];
    if (isSplit(windowDescriptor)) return getWindowsAsString(windowDescriptor.windows);
    return [windowDescriptor.app];
  });


const getAllApps = (layoutConfig) => {
  return R.pipe(
    getWindowsFlat,
    getWindowsAsString
  )(layoutConfig);
};

module.exports = {
  createLayoutConfig,
  getAllApps
};
