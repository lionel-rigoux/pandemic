const resources = require('../lib/resources-tools.js');
const ghParser = require('parse-github-url');
const shell = require('shelljs');

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
  // execSync(`git clone ${args.url} ${name}`, { stdio: 'pipe', cwd: templatesDir });
  shell.cd(templatesDir);
  const status = shell.exec(`git clone ${args.url} ${name}`);
  if (status.code !== 0) {
    logger.error(status.stderr);
    process.exit(1);
  } else {
    logger.info('Done!');
  }
};
