const path = require('path')
const mkdirp = require('mkdirp')
const os = require('os')

const resources_path = path.join(os.homedir() ,'.pandemic')
//const resources_path = path.join(__dirname,'resources')

const recipes_path = path.join(resources_path,'recipes')
mkdirp.sync(recipes_path)

const scaffolds_path = path.join(resources_path,'scaffolds')
mkdirp.sync(scaffolds_path)

module.exports = {
  RESOURCES_PATH: resources_path,
  RECIPES_PATH: recipes_path,
  SCAFFOLDS_PATH: scaffolds_path,
  TARGET_PATH: 'public'
}
