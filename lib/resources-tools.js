const fsTools = require('./fs-tools.js')
const path = require('path')
const config = require('../config.js')

module.exports = {
  getDir: function(resource) {
    switch (resource) {
      case 'recipe':
      case 'recipes':
        return config.RECIPES_PATH
      case 'scaffold':
      case 'scaffolds':
        return config.SCAFFOLDS_PATH
    }
  },
  getTemplates: function (resource) {
    switch (resource) {
      case 'recipe':
      case 'recipes':
        return this.getRecipes()
      case 'scaffold':
      case 'scaffolds':
        return this.getScaffolds()
    }
  },
  getRecipes: function() {
    return fsTools.listFiles(config.RECIPES_PATH, {type: 'folder'})
  },
  getRecipeFormats: function(recipe) {
    let recipeFolder = path.join(config.RECIPES_PATH, recipe)

    return fsTools
      .listFiles(recipeFolder, {
        type: 'file',
        filter: /^recipe\.(.*)\.json$/
      })
      .map(file => {
        return file.match(/^recipe\.(.+)\.json$/)[1]
      })
  },
  getRecipesWithFormat: function() {
    return getRecipes().map(recipe => {
      return {
        name: recipe,
        formats: getRecipeFormats(recipe)
      }
    })
  },
  getScaffolds: function() {
    return fsTools.listFiles(config.SCAFFOLDS_PATH, {type: 'folder'})
  },
}
