const resources = require('../lib/resources-tools.js')
const path = require('path')
const ghParser = require('parse-github-url');
const execSync = require('child_process').execSync;

module.exports = (args, options, logger) => {

    //TODO: allow branch and revision specific installs

    let templatesDir = resources.getDir(args.resource)

    // get template name
    let name = options.as || ghParser(args.url).repo

    // check if template already exists
    if (resources.getTemplates(args.resource).includes(name)) {
      logger.error(`There is alread a ${args.resource} named "${name}".`)
      process.exit(1)
    }

    // download template
     try {
       logger.info(`Install new ${args.resource} "${name}" from ${args.url}`)
       execSync(`git clone ${args.url} ${name}`, { stdio: 'pipe', cwd: templatesDir });
       logger.info(`Success!`)
    } catch (e) {
        logger.error(e);
    }



}
