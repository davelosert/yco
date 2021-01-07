
const { buntstift } = require('buntstift');
const { getConfig } = require('../shared/getConfig');
const { globalOptions } = require('./globalOptions');
const Ajv = require('ajv');
const betterAjvErrors = require('better-ajv-errors');

exports.validateConfigCommand = {
  name: 'validate-config',
  description: 'Validate your yco.config.json.',
  optionDefinitions: [
    ...globalOptions,
  ],

  async handle({ options }) {
    const { content, path } = await getConfig({ configPath: options.config });

    const ajv = new Ajv({ jsonPointers: true, allErrors: true });
    const schema = require('../schemas/YcoConfigSchema.json');
    const validate = ajv.compile(schema);
    const valid = validate(content);

    if (!valid) {
      buntstift.error(`Config at ${path} is invalid! The following errors occured: `);
      const output = betterAjvErrors(schema, content, validate.errors, {
        format: 'cli',
        indent: 1
      });
      buntstift.error(output);
      process.exit(1);
    }

    buntstift.success(`Config at ${path} is valid!`);
  }
};
