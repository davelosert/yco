# Yabai Configurator

**This is a heavy work in progress repository.**

## Idea

With this repository, I want to make working with yabai, skhd and ubersicht easier by providing a single configuration file in combination with powerful CLI Commands that add some logic on top of yabai - for example predefined window-layouts that can be activated by a single hotkey.

### Planned Features

- [x] Configure & Switch to preconfigured window layouts (see configuration example below)
  - [x] Write a script comparing the current with the desired layout and generate `yabai` commands accordingly
- [ ] Implement a holistic CLI Interface to execute all features
- [ ] Publish the CLI as npm binary (for npx) and/or pkg binary
- [ ] I3wm-Like focussing of spaces and/or windows for a shortcut, (e.g. `CMD + 1` for VSCode, `CMD + 2` for Firefox…)
  - [ ] Implement a generator to inject a custom, generated config into the SKHD-Config
- [ ] Toggle through windows of a certain kind (e.g. all opened Firefox Windows)
- [ ] I3wm-Like modes for SKHD in combination with a Ubersicht-Visualization

### Current Features

#### Configure & Apply Layout

You can move windows to spaces and displays by a configured pattern. As a common CLI is still missing, this is currently rather complex and static:

```shell
npm run build
node build/applyLayout.js monitor
```

This will read the [exampleConfig.json](./exampleConfig.json) and apply the layout with the key `monitor`.
The `spaces` Property is a structure consiting of nested arrays, where:

- The outer-most array is the layout containg...
- ... arrays representing displays containing ...
- ... arrays that represent spaces containing ...
- ... strings of apps that are supposed to be placed on that space.

```javascript
spaces: [
  // display1
  [
    // space 1
    [
      // App
      "App1 on Space 1",
      "App2 on Space 1"
    ],
    // space 2
    [
      "App3 on Space 2"
    ]
  ],
  // display 2
  [
    ...
  ]
]
```

The Strings representing the Apps have to match with the `app`-Field of Yabais Window-Objects. You can query all opend windows with `yabai -m query --windows`.

### Configuration

```JSON
{
  "layouts": {
    "monitor": {
      "command": "m",
      "nonManaged": "allInOneSpace",
      "spaces": [[
        ["iTerm2", "Code", "Firefox"],
        ["Toggl Track", "Google Chrome", "Slack", "Microsoft Outlook"],
        ["Microsoft Teams", "Spotify"]
      ]]
    },
    "laptop": {
      "command": "l",
      "nonManaged": "allInOwnSpace",
      "spaces": [[
          ["Code"], ["Firefox"], ["iTerm2"], ["Google Chrome", "Toggl Track"], ["Slack"], ["Microsoft Outlook"]
        ]]
    },
    "pairing": {
      "command": "p",
      "nonManaged" : "leaveUntouched",
      "spaces": [
        [],
        [["Code"], ["Firefox"], ["iTerm2"]]
      ]

    }
  }
}
```
