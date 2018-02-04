const fs = require('fs')

function getRecipes () {
  var recipes = []

  fs.readdirSync(`${__dirname}/../publish/recipes/`)
    .filter(file => !(/^\./g).test(file)) // ignore invisible
    .forEach(file => {
      recipes.push({
        name: file,
        formats: getRecipeFormats(file)
      })
    })

  return recipes
}

function getRecipeFormats (recipe) {
  let recipeFolder = `${__dirname}/../publish/recipes/${recipe}`

  // check the recipe folder exists
  if (!fs.existsSync(recipeFolder)) {
    throw Error(`Could not find recipe ${recipe}`)
  }

  // get recipe.json files
  var recipeFormats = fs.readdirSync(recipeFolder)
    .filter(file => (/^recipe\.(.*)\.json/).test(file))

  // extract formats
  var formatList = recipeFormats.map(file => {
    return file.match(/^recipe\.(.+)\.json$/)[1]
  })

  return formatList
}

module.exports = {getRecipes, getRecipeFormats}
