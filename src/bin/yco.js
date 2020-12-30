#! /usr/bin/env node

const { runYco } = require('../cli/ycoCommand');

(async function start() {
  await runYco();
})();
