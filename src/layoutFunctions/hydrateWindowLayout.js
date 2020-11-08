import { flatten, map, prop, pipe } from 'ramda';


const getWindowTitle = window => window.app;
export const hydrateWindowLayout = ({ plannedWindowSetup, actualWindows }) => 
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

export const getUnmanagedWindows = ({ hydratedWindowLayout, actualWindows: allWindows}) => {
  const managedWindowIds = getAllIdsFromFlattened(hydratedWindowLayout);
  return allWindows.filter(window => !managedWindowIds.includes(window.id));
};
