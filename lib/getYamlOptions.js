const fs = require('fs-extra');
const yamlFront = require('yaml-front-matter');

module.exports = (source) => {
  // if no options provided, check yaml header
  const frontMatter = yamlFront.loadFront(fs.readFileSync(source));

  return {
    recipe: (frontMatter.pandemic || {}).recipe,
    format: (frontMatter.pandemic || {}).format
  };
};
