
const { buntstift } = require('buntstift');
const { getConfig } = require('../shared/getConfig');
const { globalOptions } = require('./globalOptions');
const Ajv = require('ajv');

exports.validateConfigCommand = {
  name: 'validate-config',
  description: 'Validate your yco.config.json.',
  optionDefinitions: [
    ...globalOptions,
  ],

  async handle({ options }) {
    const config = await getConfig({ configPath: options.config });

    const ajv = new Ajv({ allErrors: true });
    const schema = require('../schemas/YcoConfigSchema.json');
    const validate = ajv.compile(schema);
    const valid = validate(config);

    if (!valid) {
      buntstift.error('Config is invalid! The following errors occured: ');
      validate.errors.forEach(ajvError => {
        buntstift.error(`${ajvError.dataPath} ${ajvError.message}`);
      });
      process.exit(1);
    }

    buntstift.success('Config is valid!');
  }
};
