const resources = require('../lib/resources-tools.js');

function getVersionText (resource, template) {
  const versionNb = resources.getTemplateVersionLag(resource, template);
  switch (versionNb) {
    case undefined: return 'no version available';
    case 0: return 'up to date';
    default: return `${versionNb} commits behind`;
  }
}

module.exports = (args, options, logger) => {
  const templates = resources.getTemplates(args.resource);
  if (templates.length) {
    logger.info(`Installed ${args.resource}:`);
    templates.forEach((template) => {
      const formats =
        args.resource === 'recipes' ? resources.getRecipeFormats(template) : [];
      const version = getVersionText(args.resource, template);
      logger.info(` - ${template}\t${formats.join(' ,')}\t ${version}`);
    });
    logger.info('\n');
  } else {
    logger.info(`No ${args.resource} installed. \n`);
  }
};
