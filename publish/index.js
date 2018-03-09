const fs = require('fs-extra');
const pandoc = require('./pandoc.js');
const path = require('path');
const config = require('../config.js');
const checkInstall = require('./check-install.js');
const yamlFront = require('yaml-front-matter');
const loadRecipe = require('./load-recipe.js');

module.exports = (args, options, logger) => {
  // check that pandoc and co are there
  checkInstall(logger);

  // check that the source file exists
  const source = path.resolve(process.cwd(), args.source);

  if (!fs.existsSync(source)) {
    logger.error(`*** Could not find the source file ${args.source}.`);
    process.exit(1);
  }

  // create target directory if necessary
  const targetDir = path.join(
    path.dirname(source),
    config.TARGET_PATH
  );
  fs.ensureDirSync(targetDir);

  // if no options provided, check yaml header
  const frontMatter = yamlFront.loadFront(fs.readFileSync(args.source));

  // load recipe
  const recipe = loadRecipe({
    recipe: options.to || (frontMatter.pandemic || {}).recipe,
    format: options.format || (frontMatter.pandemic || {}).format
  });
  logger.debug('Using recipe: ');
  logger.debug(recipe);
  logger.debug('');

  try {
    logger.info('Processing...');
    pandoc({
      source,
      targetDir,
      recipe
    });
    logger.info('Done!');
  } catch (err) {
    logger.error(err.message);
    process.exit(1);
  }
};
