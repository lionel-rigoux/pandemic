const shell = require('shelljs');

function checkInstall (logger, bin) {
  if (!shell.which(bin)) {
    logger.error(`*** Please install ${bin} to use pandemic.`);
    process.exit(1);
  }
}

module.exports = (logger) => {
  [
    'pandoc',
    'pandoc-fignos',
    'pandoc-eqnos',
    'pandoc-tablenos',
    'pandoc-citeproc'
  ].forEach(bin => checkInstall(logger, bin));
};
