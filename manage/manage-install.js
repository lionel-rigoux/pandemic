const resources = require('../lib/resources-tools.js');
const ghParser = require('parse-github-url');
const { spawnSync } = require('child_process');

module.exports = (args, options, logger) => {
  // TODO: allow branch and revision specific installs

  const templatesDir = resources.getDir(args.resource);

  // get template name
  const name = options.as || ghParser(args.url).name;

  // check if template already exists
  if (resources.getTemplates(args.resource).includes(name)) {
    logger.error(`There is alread a ${args.resource} named "${name}".`);
    process.exit(1);
  }

  // download template
  logger.info(`Install new ${args.resource} "${name}" from ${args.url}`);
  const ps = spawnSync(
    `git clone ${args.url} ${name}`,
    {
      cwd: templatesDir,
      shell: true
    }
  );

  // feedback
  if (ps.status !== 0) {
    logger.error(ps.stderr.toString());
    process.exit(1);
  } else {
    logger.info('Done!');
  }
};
