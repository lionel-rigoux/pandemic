const help = require('../lib/help.js')
const resources = require('../lib/resources-tools.js')

module.exports = (args, options, logger) => {
  let templates = resources.getTemplates(args.resource)
  if (templates.length) {
    logger.info(`Installed ${args.resource}:`)
    templates.forEach(template => {
      let formats =
        args.resource === 'recipes' ? resources.getRecipeFormats(template) : []
      let versionN = resources.getTemplateVersionLag(args.resource, template)
      let version = versionN === 0 ? 'up to date' : `${versionN} commits behind`
      logger.info(` - ${template}\t${formats.join(' ,')}\t ${version}`)
    })
    logger.info('\n')
  } else {
    logger.info(`No ${args.resource} installed. \n`)
  }
}
