const fs = require('fs')
const fsTools = require('./fs-tools.js')
const path = require('path')
const resources = require('./resources-tools.js')
const config = require('../config.js')


const formatMap = {
  'pdf': ['.tex','.latex'],
  'docx': ['.doc','.docx'],
  'html': ['.html']
}


function loadDefault(format) {
  let recipeFilePath = path.join(__dirname,'..','_defaults',`recipe.${format}.json`)
  if (fs.existsSync(recipeFilePath)) {
    return require(recipeFilePath)
  } else {
    // not even a defaut recipe!
    return {
      name: 'default',
      format: format
    }
  }
}

module.exports = function (recipe, format) {


if (!recipe) {
/* if no recipe defined at all */

  // set default format to pdf
  format = format || 'pdf'

  // load recipe from default
  return loadDefault(format)

} else {
/* if a template is provided */

  let recipePath = path.join(config.RECIPES_PATH, recipe)

  // try and load recipe for the format if provided
  if (format) {

    let recipeFilePath = path.join(recipePath, `recipe.${format}.json`)
    if (fs.existsSync(recipeFilePath)) {
    /* well behave recipe, load the instruction */
      return require(recipeFilePath)

    } else {
    /* no recipe file, but the format can help guess the template */

      // start with default
      let recipeJson = loadDefault(format)

      // see if we can find a file that look like a template
      let candidates = fsTools
        .listFiles(recipePath, { type: 'file'})
        .filter( file => {
          return formatMap[format].includes(path.extname(file))
        })

      // use best candidate as template
      if (candidates.length === 1) {
        recipeJson.template = candidates[0]
      }

      // return
      return recipeJson
    }

  } else { // if format
  /* we don't have the format, but we can see if a template seems plausible */

  // see if we can find a file that look like a template
  let extList = Object.values(formatMap)
  let candidates = fsTools
    .listFiles(recipePath, { type: 'file'})
    .filter( file => {
      return extList.includes(path.extname(file))
    })
  if (candidates.length === 1) {
  // we have a unique winner
    let template = candidates[0]

    // TODO
  }

  }

}


}
