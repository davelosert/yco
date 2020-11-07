export const lookupWindows = ({ plannedWindowSetup, actualWindows }) => 
  plannedWindowSetup.map(spacesOfDisplay => 
    spacesOfDisplay.map((windowSettings) => 
      windowSettings.reduce((currentWindows, windowSetting) => 
        [
          ...currentWindows, 
          ...actualWindows.filter(actualWindow => actualWindow.title === windowSetting)
        ]
      , []))
  );
