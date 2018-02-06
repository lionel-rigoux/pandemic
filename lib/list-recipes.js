const fsTools = require('./fs-tools.js')
const recipesFolder = `${__dirname}/../publish/recipes/`

function getRecipes () {
  return fsTools
    .listFiles(recipesFolder, {type: 'folder'})
    .map(recipe => {
      return {
        name: recipe,
        formats: getRecipeFormats(recipe)
      }
    })
}

function getRecipeFormats (recipe) {
  let recipeFolder = path.join(recipesFolder,recipe)

  return fsTools
    .listFiles(recipeFolder, {
      type: 'file',
      filter: /^recipe\.(.*)\.json$/
    })
    .map(file => {
      return file.match(/^recipe\.(.+)\.json$/)[1]
    })
}

module.exports = {getRecipes, getRecipeFormats}
