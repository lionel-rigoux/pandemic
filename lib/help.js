const resources = require('./resources-tools.js');

module.exports = {
  dispFormats (logger, recipe) {
    const recipeFormats = resources.getRecipeFormats(recipe);

    if (recipeFormats) {
      logger.info(`\n Available format(s) for ${recipe} recipe: ${recipeFormats}`);
    } else {
      logger.info('No instructions could be found for this recipe...');
    }
    logger.info('\n');
  },

  dispRecipes (logger) {
    const recipes = resources.getRecipes();
    if (recipes.length) {
      logger.info('Installed recipes:');
      logger.info(recipes);
      logger.info('\n');
    } else {
      logger.info('No recipes installed. \n');
    }
  },

  dispScaffolds (logger) {
    const scaffolds = resources.getScaffolds();
    if (scaffolds.length) {
      logger.info('Installed scaffolds:');
      logger.info(scaffolds);
      logger.info('\n');
    } else {
      logger.info('No scaffolds installed. \n');
    }
    logger.info('\n');
  },

  dispResource (resource, logger) {
    switch (resource) {
      case 'recipe':
      case 'recipes':
        this.dispRecipes(logger);
        break;
      case 'scaffold':
      case 'scaffolds':
        this.dispScaffolds(logger);
        break;
      default:
        logger.error('Unkown resource type.');
        process.exit(1);
    }
  }
};
