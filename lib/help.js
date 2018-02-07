const resources = require('./resources-tools.js')

module.exports = {

  dispFormats: function (logger, recipe) {
      let recipeFormats = resources.getRecipeFormats(recipe)

      if (recipeFormats) {
        logger.info(`\n Available format(s) for ${recipe} recipe: ${recipeFormats}`)
      } else {
        logger.info('No instructions could be found for this recipe...')
      }
      logger.info('\n')
  },

  dispRecipes: function (logger) {
    logger.info(`Available recipes: \n`)
    resources
      .getRecipes()
      .forEach(recipe => {
        logger.info(`  - ${recipe}`)
      })
    logger.info('\n')
  }


}
