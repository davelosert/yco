const { flatten, map, prop, pipe } = require('ramda');


const getWindowTitle = window => window.app;
exports.hydrateWindowLayout = ({ plannedWindowSetup, actualWindows }) =>
  plannedWindowSetup.map(displayLayout =>
    displayLayout.map((spacesLayout) =>
      spacesLayout.reduce((hydratedWindowLayout, windowLayout) =>
        [
          ...hydratedWindowLayout,
          ...actualWindows.filter(actualWindow => getWindowTitle(actualWindow) === windowLayout)
        ]
        , []))
  );

const getAllIdsFromFlattened = pipe(
  flatten,
  map(prop('id'))
);
exports.getUnmanagedWindows = ({ hydratedWindowLayout, actualWindows: allWindows }) => {
  const managedWindowIds = getAllIdsFromFlattened(hydratedWindowLayout);
  return allWindows.filter(window => !managedWindowIds.includes(window.id));
};
