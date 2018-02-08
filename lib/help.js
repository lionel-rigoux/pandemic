const resources = require('./resources-tools.js')

module.exports = {
  dispFormats: function(logger, recipe) {
    let recipeFormats = resources.getRecipeFormats(recipe)

    if (recipeFormats) {
      logger.info(
        `\n Available format(s) for ${recipe} recipe: ${recipeFormats}`
      )
    } else {
      logger.info('No instructions could be found for this recipe...')
    }
    logger.info('\n')
  },

  dispRecipes: function(logger) {
    let recipes = resources.getRecipes()
    if (recipes.length) {
      logger.info(`Installed recipes:`)
      logger.info(recipes)
      logger.info('\n')
    } else {
      logger.info('No recipes installed. \n')
    }
  },

  dispScaffolds: function(logger) {
    let scaffolds = resources.getScaffolds()
    if (scaffolds.length) {
      logger.info(`Installed scaffolds:`)
      logger.info(scaffolds)
      logger.info('\n')
    } else {
      logger.info('No scaffolds installed. \n')
    }
    logger.info('\n')
  },

  dispResource: function(resource, logger) {
    switch (resource) {
      case 'recipe':
      case 'recipes':
        this.dispRecipes(logger)
        break
      case 'scaffold':
      case 'scaffolds':
        this.dispScaffolds(logger)
        break
    }
  }
}
