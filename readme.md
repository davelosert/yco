# Yabai Configurator

**This is a heavy work in progress project.**

## Idea

With this cli-tool, I want to make working with yabai, skhd and ubersicht easier by providing a single configuration file in combination with powerful CLI Commands that add some logic on top of yabai - for example predefined window-layouts that can be activated by a single hotkey.

## How to run

```shell
npx yco
```

This will start an interactive CLI where you can choose all tasks and configurations.

You can also see all possible tasks and cli-flags by using the `--help`:

```shell
npx yco --help
npx yco apply-layout --help
```

### Install globally

You can also install yco globaly and then use it right away:

```shell
npm install -g yco
yco --help
```

## YCO Configuration

Almost every command needs to be configured with the `yco.config.json`. It is the heart of this tool.

### Location

On default, the config will be read from:

```shell
~/.config/yabai/yco.config.json
```

You can also pass a specific configuration with the `--config`-Option which will take precedence over the default path:

```shell
npx yco --config custom/path/to/config.json <task>
```

## Current Features

### apply-layout

```shell
npx yco apply-layout --name nameOfLayout
```

Apply a preconfigured layout. A layout defines which windows are supposed to be in which spaces. The command will use `yabai` to compare the current location of all windows and move them to the configured spaces accordingly while creating all necessary an deleting all unused spaces.

#### Layout Configuration

A real-world layout configuration might look like this:

```json
{
  "layouts": {
    "nameOfLayout": {
      "nonManaged": "allInOneSpace",
      "spaces": [[
        ["iTerm2", "Code", "Firefox"],
        ["Google Chrome", "Slack", "Microsoft Outlook"],
        ["Spotify"]
      ]]
    },
}
```

The `spaces` Property is a structure consiting of nested arrays, where:

- The outer-most array is the **layout** containg...
- ... arrays representing **displays** containing ...
- ... arrays that represent **spaces** containing ...
- ... strings of **apps (alias windows)** that are supposed to be placed on that space.

```javascript
spaces: [
  // display1
  [
    ["Window 1 on Space 1", "Window 2 on Space 1" ],
    ["Window 3 on Space 2"]
  ],
  // display 2
  [
    ["window 4 on Space 3 on Display 2"]
    ...
  ]
]
```

The Strings representing the windows have to match with the `app`-Field of Yabai's window objects. You can query all opened windows with `yabai -m query --windows`.

The `nonManaged` configuration decides how to treat all currently opened windows which are not found in the `spaces` configuration of the layout (hence the name "unmanaged"). It can be one of three options:

1. `allInOneSpace`: All unmanaged windows will be placed in one space which is placed **last on the main display**.
2. `allInOwnSpace`: For every unmanaged window, a **new space** is created on the **main display**.
3. `leaveUntouched`: Will leave all unmanaged windows exactly where they are.

*Please note: Currently, the order order of windows on a space is not guaranteed to be as configured (this is a bit harder to implement with yabai commands). This is a planned feature, however.*

## Planned Features

- [x] Configure & Switch to preconfigured window layouts (see configuration example below)
  - [x] Write a script comparing the current with the desired layout and generate `yabai` commands accordingly
- [x] Implement a holistic CLI Interface to execute all features
- [x] Publish the CLI as npm binary (for npx)
- [x] Drastically improve documentation
- [ ] Add feature to add SKHD Shortcuts starting certain yco tasks
  - [ ] Implement a generator to inject a custom, generated config into the SKHD-Config
  - [ ] Add a `layout-mode` to apply certain layout on a keypress
  - [ ] I3wm-Like focussing of spaces and/or windows for a shortcut, (e.g. `CMD + 1` for VSCode, `CMD + 2` for Firefox…)
- [ ] Toggle through windows of a certain kind (e.g. all opened Firefox Windows)
- [ ] I3wm-Like modes for SKHD in combination with a Ubersicht-Visualization

## Full Configuration Example

See [exampleConfig.json](./exampleConfig.json).
