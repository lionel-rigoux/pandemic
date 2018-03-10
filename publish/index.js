const fs = require('fs-extra');
const pandoc = require('./pandoc.js');
const path = require('path');
const loadInstructions = require('./load-instructions.js');
const getYamlOptions = require('../lib/getYamlOptions.js');

module.exports = (args, options, logger) => {
  // check that the source file exists
  const source = path.resolve(process.cwd(), args.source);

  if (!fs.existsSync(source)) {
    logger.error(`*** Could not find the source file ${args.source}.`);
    process.exit(1);
  }

  // if no options provided, check yaml header
  const yamlOptions = getYamlOptions(args.source);

  // load recipe
  const instructions = loadInstructions({
    recipe: options.to || yamlOptions.recipe,
    format: options.format || yamlOptions.format
  });
  logger.debug('Using recipe: ');
  logger.debug(instructions);
  logger.debug('');

  try {
    logger.info('Processing...');
    pandoc({
      source,
      instructions
    });
    logger.info('Done!');
  } catch (err) {
    logger.error(err.message);
    process.exit(1);
  }
};
