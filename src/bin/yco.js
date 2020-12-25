#! /usr/bin/env node

// eslint-disable-next-line no-global-assign
require = require('esm')(module/*, options*/);
const { runYco } = require('../cli/ycoCommand');

(async function start() {
  await runYco();
})();
