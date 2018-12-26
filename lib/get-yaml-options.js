const fs = require('fs-extra');
const yamlFront = require('yaml-front-matter');

module.exports = (source) => {
  // if no options provided, check yaml header
  const frontMatter = yamlFront.loadFront(fs.readFileSync(source));

  // ensure pandemic options are defined
  if (!frontMatter.pandemic) {
    frontMatter.pandemic = {};
  }

  // clean a little bit
  delete frontMatter.__content;

  return frontMatter;
};
