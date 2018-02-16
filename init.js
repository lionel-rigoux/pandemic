const config = require('./config.js');
const path = require('path');
const fs = require('fs-extra');

module.exports = (logger) => {
  // If no resource folder, create and initialize with some tempaltes
  if (!fs.existsSync(config.RESOURCES_PATH)) {
    const initPath = path.join(__dirname, '_init');
    logger.info(`Creating ${config.RESOURCES_PATH} to store your templates.`);
    fs.mkdirSync(config.RESOURCES_PATH);
    fs.copySync(
      initPath,
      config.RESOURCES_PATH,
      { overwrite: false }
    );
  }
};
