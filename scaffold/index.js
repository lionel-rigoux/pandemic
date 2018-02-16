/* scaffolding:
Copy a file tree from one of the package templates to current directory
 */

const fs = require('fs-extra');
const config = require('../config.js');
const path = require('path');
const help = require('../lib/help.js');

function copyFilter (fileName) {
  return path.basename(fileName) !== '.git';
}

module.exports = (args, options, logger) => {
  // get source and target folders
  const templatePath = path.join(config.SCAFFOLDS_PATH, args.template);
  const localPath = process.cwd();

  // optional destructive copying
  const override = options.override || false;

  // check if the template exists or give some help
  if (!fs.existsSync(templatePath)) {
    logger.error(`*** The requested template "${args.template}" wasn't found.`);
    help.dispScaffolds(logger);
    process.exit(1);
  }

  // start copy
  logger.info('Copying files...');
  const copyOptions = {
    overwrite: override,
    errorOnExist: true,
    filter: copyFilter
  };
  try {
    fs.copySync(
      templatePath,
      localPath,
      copyOptions
    );
  } catch (err) {
    logger.error('The files could not be copied:');
    logger.error(` - ${err}`);
    process.exit(1);
  }

  // confirm success
  logger.info('The files have been copied!');
};
