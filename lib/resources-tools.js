const fsTools = require('./fs-tools.js')
const path = require('path')
const config = require('../config.js')
const execSync = require('child_process').execSync

module.exports = {
  getDir (resource) {
    switch (resource) {
      case 'recipe':
      case 'recipes':
        return config.RECIPES_PATH
      case 'scaffold':
      case 'scaffolds':
        return config.SCAFFOLDS_PATH
    }
  },
  getTemplates (resource) {
    switch (resource) {
      case 'recipe':
      case 'recipes':
        return this.getRecipes()
      case 'scaffold':
      case 'scaffolds':
        return this.getScaffolds()
    }
  },
  getRecipes () {
    return fsTools.listFiles(config.RECIPES_PATH, { type: 'folder' })
  },
  getRecipeFormats (recipe) {
    const recipeFolder = path.join(config.RECIPES_PATH, recipe)

    return fsTools
      .listFiles(recipeFolder, {
        type: 'file',
        filter: /^recipe\.(.*)\.json$/
      })
      .map(file => file.match(/^recipe\.(.+)\.json$/)[1])
  },
  getScaffolds () {
    return fsTools.listFiles(config.SCAFFOLDS_PATH, { type: 'folder' })
  },
  getTemplateVersionLag (resource, name) {
    const templateDir = path.join(config.RESOURCES_PATH, resource, name)
    try {
      const v = execSync('git rev-list HEAD..origin --count', {
        stdio: 'pipe',
        cwd: templateDir
      }).toString()
      return parseInt(v)
    } catch (err) {
      return undefined
    }
  }
}
