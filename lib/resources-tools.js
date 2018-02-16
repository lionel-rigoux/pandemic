const fsTools = require('./fs-tools.js');
const path = require('path');
const config = require('../config.js');
const { execSync } = require('child_process');

module.exports = {
  getDir (resource) {
    let templatePath;
    switch (resource) {
      case 'recipe':
      case 'recipes':
        templatePath = config.RECIPES_PATH;
        break;
      case 'scaffold':
      case 'scaffolds':
        templatePath = config.SCAFFOLDS_PATH;
        break;
      default:
    }
    return templatePath;
  },
  getTemplates (resource) {
    let templates;
    switch (resource) {
      case 'recipe':
      case 'recipes':
        templates = this.getRecipes();
        break;
      case 'scaffold':
      case 'scaffolds':
        templates = this.getScaffolds();
        break;
      default:
    }
    return templates;
  },
  getRecipes () {
    return fsTools.listFiles(config.RECIPES_PATH, { type: 'folder' });
  },
  getRecipeFormats (recipe) {
    const recipeFolder = path.join(config.RECIPES_PATH, recipe);

    return fsTools
      .listFiles(recipeFolder, {
        type: 'file',
        filter: /^recipe\.(.*)\.json$/
      })
      .map(file => file.match(/^recipe\.(.+)\.json$/)[1]);
  },
  getScaffolds () {
    return fsTools.listFiles(config.SCAFFOLDS_PATH, { type: 'folder' });
  },
  getTemplateVersionLag (resource, name) {
    const templateDir = path.join(config.RESOURCES_PATH, resource, name);
    try {
      const v = execSync('git rev-list HEAD..origin --count', {
        stdio: 'pipe',
        cwd: templateDir
      }).toString();
      return parseInt(v, 10);
    } catch (err) {
      return undefined;
    }
  }
};
