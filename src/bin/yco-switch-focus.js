#! /usr/bin/env node

/**
 * USAGE: yco-switch-focus.js "appNameToFocus" (e.g. yco-switch-focus "Firefox")
 * 
 * REASON:
 * This binary file is a shortcut for applying the switch-focus command.
 * You shouldn't be using it directly, but rather through skhd-shortcuts.
 * 
 * It was extracted to improve the performance as there can be a notable
 * delay when using the "yco"-binary due to it's size.
 */
const { switchFocus } = require('../tasks/switchFocus');
const { createYabaiAdapter } = require('../shared/createYabaiAdapter');
const { withChildProcessExec } = require('../shared/withChildProcessExec');

(async function start() {
  const appToFocus = process.argv[2];
  const yabaiAdapter = withChildProcessExec(createYabaiAdapter);
  await switchFocus({
    windowQuery: {
      app: appToFocus
    },
    yabaiAdapter
  });
})();
