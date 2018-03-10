const fs = require('fs-extra');
const pandoc = require('./pandoc.js');
const path = require('path');
const loadRecipe = require('./load-recipe.js');
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
  const recipe = loadRecipe({
    recipe: options.to || yamlOptions.recipe,
    format: options.format || yamlOptions.format
  });
  logger.debug('Using recipe: ');
  logger.debug(recipe);
  logger.debug('');

  try {
    logger.info('Processing...');
    pandoc({
      source,
      recipe
    });
    logger.info('Done!');
  } catch (err) {
    logger.error(err.message);
    process.exit(1);
  }
};
