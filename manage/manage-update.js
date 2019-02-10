const resources = require('../lib/resources-tools.js');
const path = require('path');
const { spawnSync } = require('child_process');

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
  const ps = spawnSync(
    `git pull`,
    {
      cwd: path.join(templatesDir, args.name),
      shell: true
    }
  );
  if (ps.status !== 0) {
    logger.error(ps.stderr.toString());
    process.exit(1);
  } else {
    logger.info('Done!');
  }
};
