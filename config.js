const path = require('path')
const os = require('os')

const resources_path = path.join(os.homedir() ,'.pandemic')
const recipes_path = path.join(resources_path,'recipes')
const scaffolds_path = path.join(resources_path,'scaffolds')

module.exports = {
  RESOURCES_PATH: resources_path,
  RECIPES_PATH: recipes_path,
  SCAFFOLDS_PATH: scaffolds_path,
  TARGET_PATH: 'public'
}
