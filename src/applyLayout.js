import { execYabai } from './commandExecuter';
import { getUnmanagedWindows, hydrateWindowLayout } from './layoutFunctions/hydrateWindowLayout';
import { countSpacesPerDisplay, planSpaces } from './layoutFunctions/planSpaces';
import { createSpaceCommands } from './layoutFunctions/createSpaceCommands';

const mockConfig = {
  'layouts': {
    'monitor': {
      'command': 'm',
      'nonManaged': 'allInOneSpace',
      'spaces': [[
        ['iTerm2', 'Code', 'Firefox'],
        ['Toggl', 'Google Chrome', 'Slack', 'Outlook'],
        ['Teams', 'Spotify']
      ]]
    },
    'laptop': {
      'command': 'l',
      'nonManaged': 'allInOwnSpace',
      'spaces': [
        [
          [['Code'], ['Firefox'], ['iTerm2'], ['Google Chrome', 'Toggl'], ['Slack'], ['Outlook']]
        ]
      ]
    },
    'pairing': {
      'command': 'p',
      'nonManaged' : 'leaveUntouched',
      'spaces': [
        [],
        [['Code'], ['Firefox'], ['iTerm2']]
      ]

    }
  }
};


export const applyWindowLayout = async (desiredLayout) => {
  const currentSpaces = await execYabai('-m query --spaces');
  const actualWindows = await execYabai('-m query --windows');

  const hydratedWindowLayout = hydrateWindowLayout({
    actualWindows,
    plannedWindowSetup: desiredLayout.spaces
  });

  const unmanagedWindows = getUnmanagedWindows({hydratedWindowLayout, actualWindows});
  hydratedWindowLayout[0].push(unmanagedWindows);

  const spacesPlan = planSpaces({currentSpaces, desiredSpaces: hydratedWindowLayout});
  const spacesCount = countSpacesPerDisplay(currentSpaces);

  const commands = [
    ...createSpaceCommands({ spacesPlan, spacesCount}),
  ];

  console.log(commands);
};

(async function start() {
  await applyWindowLayout(mockConfig.layouts.monitor);
})();
