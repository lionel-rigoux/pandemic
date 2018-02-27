const resources = require('../lib/resources-tools.js');
const path = require('path');
const shell = require('shelljs');

module.exports = (args, options, logger) => {
  // TODO: allow branch and revision specific installs

  const templatesDir = resources.getDir(args.resource);

  // check if template already exists
  if (!resources.getTemplates(args.resource).includes(args.name)) {
    logger.error(`Cannot find a ${args.resource} named "${args.name}".`);
    process.exit(1);
  }

  // update template
  logger.info(`Updating ${args.resource} "${args.name}"...`);
  shell.cd(path.join(templatesDir, args.name));
  const status = shell.exec('git pull');
  if (status.code !== 0) {
    logger.error(status.stderr);
    process.exit(1);
  } else {
    logger.info('Done!');
  }
};
