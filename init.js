const config = require('./config.js')
const path = require('path')
const fs = require('fs-extra')

module.exports = (logger) => {
  // If no resource folder, create and initialize with some tempaltes
  if (!fs.existsSync(config.RESOURCES_PATH)) {
    let initPath = path.join(__dirname, '_init')
    fs.mkdirSync(config.RESOURCES_PATH)
    fs.copySync(
      initPath,
      config.RESOURCES_PATH,
      {overwrite: false}
    )
  }
}
