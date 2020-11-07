export const lookupWindows = ({ plannedWindowSetup, actualWindows }) => 
  plannedWindowSetup.map((windowSettings) => 
    windowSettings.reduce((currentWindows, windowSetting) => 
      [
        ...currentWindows, 
        ...actualWindows.filter(actualWindow => actualWindow.title === windowSetting)
      ]
    , [])
  );
