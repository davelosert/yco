# Yabai Configurator

**This is a heavy work in progress project.**

## Idea

With this cli-tool, I want to make working with [yabai](https://github.com/koekeishiya/yabai), [skhd](https://github.com/koekeishiya/skhd) and [Übersicht](https://github.com/felixhageloh/uebersicht) easier by providing a single configuration file in combination with powerful CLI Commands that add some logic on top of yabai - for example predefined window-layouts that can be activated by a single hotkey.

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

You can also install yco globaly and then use it's bin without `npx`:

```shell
npm install -g yco
yco --help
```

### Requirements

You need to have at least [yabai](https://github.com/koekeishiya/yabai) and [skhd](https://github.com/koekeishiya/skhd) installed.

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

### create-configs

```shell
yco create-configs
```

Create all configs for the other tools (`yabai`, `skhd`, `ubersicht`) from your central `yco.config.json`.

Currently, this only adds a `skhd`-config creating a separate file `~/.config/yabai/yco.skhd.conf` and loading it within `~/.skhdrc`.
The `yco.skhd.conf` is populated with a mode-command that lets you switch between your configured layouts (see [apply-layout](###apply-layout)) with two shortcuts.

### apply-layout

```shell
yco apply-layout --name nameOfLayout
```

Apply a preconfigured layout. A layout defines which windows are supposed to be in which spaces. The command will use `yabai` to compare the current location of all windows and move them to the configured spaces accordingly while creating all necessary an deleting all unused spaces.

#### Layout Configuration

A real-world layout configuration might look like this:

```json
{
  "layoutModeTriggerKey": "alt - s",
  "layouts": {
    "nameOfLayout": {
      "triggerKey": "n",
      "nonManaged": "allInOneSpace",
      "spaces": [[
        ["iTerm2", "Code", "Firefox"],
        ["Google Chrome", "Slack", "Microsoft Outlook"],
        ["Spotify"]
      ]]
    },
}
```

#### Layout-Mode

The Layout-Mode is basically just a predefined `skhd-config` that lets you apply the configured layouts with a simple two-setp hotkey-combination.
It will get activated once you execute `yco create-config` (see [create-config](###create-configs)).

E.g. to apply the layout configured above, you'd have to press:

- The `layoutModeTriggerKey`: `alt - s`
- The `triggerKey` of the target layout:`n`

To learn more about *modes*, read [What are skhd-modes?](###what-are-skhd-modes) and [What are yco-modes?](###what-are-yco-modes)

#### Layouts

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

## Q & A

### What are skhd-modes?

Even though your keyboard has a lot of different keys, finding a free hotkey-combination can sometimes be really cumbersome.

That's why SKHD created modes. A mode lets your overwrite or overload certain hotkeys with different actions - depending on the currently active mode.

This is best explained with an example. Have a look at this skhd-config:

```conf
# Keypress in default mode
alt - l : echo "Default Mode"
# Define the "layoutMode"
:: layoutMode @
# Activate layoutMode with alt-s
alt - s ; layoutMode
layoutMode < alt - l : echo "Layout Mode"
# Go back to default mode with "escape"
layoutMode < escape ; default
```

- When pressing `alt - l`, "Default Mode" will be echoed
- When pressing `alt - s`, the layoutMode is activated
- Now pressing `alt - l` again will echo "Layout Mode"
- Pressing `escape` exits the mode again.
- Pressing`alt - l` now will again echo "Default Mode"

This is great to have the same hotkeys in different contexts - thus, you don't need to invent new hotkeys over and over.

### What are yco-modes?

There are certain actions that do not need a "first class" hotkey-combination as they do not get executed that often.

For example `apply-layout` is something that you probably only need a few times a day. I'd be a waste to have to find a unique hotkey-combination for every defined layout.

That's why **modes in YCO** do not only override hotkey-combinations once activated, they always automatically come back to the default-mode once an action has been taken.

The idea is:

1. Activate the mode
2. Execute an action within that mode and immidiately come back to default mode

This means that you need to press two hotkey-combinations to use `apply-layout` - however, this gives you two big advantages:

1. You only need one hotkey-combination in your default layout
2. You can give easy to remember hotkeys to every layout, e.g. the first letter of the layout. As the layoutMode is exited immidiately, you can even define just simple letters.

Both makes it easier to find free keys as well as remember those keys.

Exiting a mode in skhd is done by appending a command to simulate an `escape`-keypress to every mode-action.

## Full Configuration Example

See [exampleConfig.json](./exampleConfig.json).
