const path = require('path')
const mkdirp = require('mkdirp')
const os = require('os')
const fs = require('fs')
const ncp = require('ncp').ncp

const resources_path = path.join(os.homedir() ,'.pandemic')

if (! fs.existsSync(resources_path)) {
  let initPath = path.join(__dirname,'_init')
  ncp(initPath, resources_path, err => {
      if (err) {
        console.log(`Could not initialise resource repository: ${resources_path}`)
        process.exit(1)
      }
    })
}

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
