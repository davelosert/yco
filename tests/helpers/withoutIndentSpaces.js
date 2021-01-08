
exports.withoutIndentSpaces = multilineString => multilineString
  .replace(/^\s*/g, '')
  .replace(/(\n\s*)/g, '\n')
  .replace(/\n$/g, '');
