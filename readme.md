# Yabai Configurator

work in progress

## Idea

With this repository,
I want to make working with yabai, skhd and ubersicht easier

### Configuration

```JSON
{
  "layouts": {
    "monitor": {
      "command": "m",
      "nonManaged": "allInOneSpace",
      "spaces": {[
        ["iTerm2", "Code", "Firefox"],
        ["Toggl", "Google Chrome", "Slack", "Outlook"],
        ["Teams", "Spotify"]
      ]}
    },
    "laptop": {
      "command": "l",
      "nonManaged": "allInOwnSpace",
      "spaces": [
        [
          ["Code"], ["Firefox"], ["iTerm2"], ["Google Chrome", "Toggl"], ["Slack"], ["Outlook"]
        ]
      ]
    }
  }
```
