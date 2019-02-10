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
  env.PATH += path.delimiter + path.join(nodeModulesPath, '.bin');

  // add compiled binaries
  // ---------------------------------------------------------------------------
  const vendorPath = findUp.sync(
    'bin',
    { cwd: __dirname }
  );
  env.PATH += path.delimiter + path.join(vendorPath, 'pandoc');
  env.PATH += path.delimiter + path.join(vendorPath, 'crossref');

  // return updated env
  // ---------------------------------------------------------------------------
  return env;
};
