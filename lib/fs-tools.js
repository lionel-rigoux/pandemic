const fs = require('fs');
const path = require('path');

function listFiles (folder, options = {}) {
  if (!fs.existsSync(folder)) {
    throw Error(`Folder ${folder} does not exist.`);
  }

  let items = fs.readdirSync(folder).filter(file => !/^\./g.test(file)); // ignore invisible

  switch (options.type) {
    case undefined:
      break;
    case 'folder':
      items = items.filter(item =>
        fs.statSync(path.join(folder, item)).isDirectory());
      break;
    case 'file':
      items = items.filter(item =>
        fs.statSync(path.join(folder, item)).isFile());
      break;
    default:
      throw Error(`Unknown type ${options.type}.`);
  }

  if (options.filter) {
    items = items.filter(item => options.filter.test(item));
  }

  return items;
}

module.exports = { listFiles };
