import { promises } from 'fs';

const { appendFile, mkdir, readFile, writeFile } = promises;

export const createFSAdapter = () => ({
  appendFile,
  readFile,
  mkdir,
  writeFile
});
