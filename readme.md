# Yabai Configurator

**This is a heavy work in progress repository.**

## Idea

With this repository, I want to make working with yabai, skhd and ubersicht easier by providing a single configuration file in combination with powerful CLI Commands that add some logic on top of yabai - for example predefined window-layouts that can be activated by a single hotkey.

### Planned Features

- [ ] Configure & Switch to preconfigured window layouts (see configuration example below)
  - [ ] Write a script comparing the current with the desired layout and generate `yabai` commands accordingly
- [ ] Implement a holistic CLI Interface to execute all features
- [ ] I3wm-Like focussing of spaces and/or windows for a shortcut, (e.g. `CMD + 1` for VSCode, `CMD + 2` for Firefox…)
  - [ ] Implement a generator to inject a custom, generated config into the SKHD-Config
- [ ] Toggle through windows of a certain kind (e.g. all opened Firefox Windows)
- [ ] I3wm-Like modes for SKHD in combination with a Ubersicht-Visualization

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
