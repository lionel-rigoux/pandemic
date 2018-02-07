const help = require('../lib/help.js')

module.exports = (args, options, logger) => {
  switch (args.resource) {
    case 'scaffolds':
      help.dispScaffolds(logger)
      break
    case 'recipes':
      help.dispRecipes(logger)
      break
  }
}
