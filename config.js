const path = require('path');
const os = require('os');

const resourcesPath = path.join(os.homedir(), '.pandemic');
const recipesPath = path.join(resourcesPath, 'recipes');
const scaffoldsPath = path.join(resourcesPath, 'scaffolds');

module.exports = {
  RESOURCES_PATH: resourcesPath,
  RECIPES_PATH: recipesPath,
  SCAFFOLDS_PATH: scaffoldsPath,
  TARGET_PATH: '_public'
};
