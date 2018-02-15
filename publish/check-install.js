const shell = require('shelljs')

function _checkInstall (logger, bin) {
  if (!shell.which(bin)) {
    logger.error(`*** Please install ${bin} to use pandemic.`)
    process.exit(1)
  }
}

module.exports = (logger) => {
  [
    'pandoc',
    'pandoc-fignos',
    'pandoc-eqnos',
    'pandoc-tablenos'
  ].forEach(bin => _checkInstall(logger, bin))
}
