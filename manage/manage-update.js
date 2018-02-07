const resources = require('../lib/resources-tools.js')
const path = require('path')
const ghParser = require('parse-github-url');
const execSync = require('child_process').execSync;

module.exports = (args, options, logger) => {

    //TODO: allow branch and revision specific installs

    let templatesDir = resources.getDir(args.resource)

    // check if template already exists
    if (!resources.getTemplates(args.resource).includes(args.name)) {
      logger.error(`Cannot find a ${args.resource} named "${args.name}".`)
      process.exit(1)
    }

    // update template
     try {
       logger.info(`Updating ${args.resource} "${args.name}"...`)
       execSync(`git pull`, {
         stdio: 'pipe',
         cwd: path.join(templatesDir, args.name)
       });
       logger.info(`Success!`)
    } catch (e) {
        logger.error(e);
    }



}
