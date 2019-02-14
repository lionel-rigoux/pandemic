const path = require('path');
const findUp = require('find-up');

module.exports = () => {
  // start from default env
  // ---------------------------------------------------------------------------
  const env = Object.assign(process.env);

  // add binaries provided as node modules, eg. cross-env
  // ---------------------------------------------------------------------------
  const nodeModulesPath = findUp.sync(
    'node_modules',
    { cwd: __dirname }
  );
  env.PATH = path.join(nodeModulesPath, '.bin') + path.delimiter + env.PATH;

  // add compiled binaries
  // ---------------------------------------------------------------------------
  const vendorPath = findUp.sync(
    'bin',
    { cwd: __dirname }
  );
  env.PATH = path.join(vendorPath, 'pandoc') + path.delimiter + env.PATH;
  env.PATH = path.join(vendorPath, 'crossref') + path.delimiter + env.PATH;

  // return updated env
  // ---------------------------------------------------------------------------
  return env;
};
