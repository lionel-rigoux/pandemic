const fsTools = require('./fs-tools.js')
const path = require('path')
const recipesFolder = path.join(__dirname, '/../publish/recipes/')

module.exports = {
  getRecipes: function() {
    return fsTools.listFiles(recipesFolder, {type: 'folder'})
  },
  getRecipeFormats: function(recipe) {
    let recipeFolder = path.join(recipesFolder, recipe)

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
  }
}
