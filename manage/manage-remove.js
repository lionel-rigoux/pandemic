const help = require('../lib/help.js');
const resources = require('../lib/resources-tools.js');
const fse = require('fs-extra');
const path = require('path');

module.exports = (args, options, logger) => {
  const templatesDir = resources.getDir(args.resource);

  // check if template exists
  if (!resources.getTemplates(args.resource).includes(args.name)) {
    logger.error(`Cannot find a ${args.resource} named "${args.name}".`);
    help.dispResource(args.resource, logger);
    process.exit(1);
  }

  // delete recipeFolder
  const rFolder = path.join(templatesDir, args.name);
  logger.info(`Uninstalling ${args.resource} "${args.name}"...`);
  logger.debug(`Deleting ${rFolder}`);
  fse.removeSync(rFolder);
  logger.info('Sucess!');
};
