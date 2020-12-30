const { promises } = require('fs');

const { appendFile, mkdir, readFile, writeFile } = promises;

exports.createFSAdapter = () => ({
  appendFile,
  readFile,
  mkdir,
  writeFile
});
