const prog = require('caporal');
const manageList = require('./manage-list.js');
const manageInstall = require('./manage-install.js');
const manageRemove = require('./manage-remove.js');
const manageUpdate = require('./manage-update.js');

module.exports = () => {
  prog
    .command('resource list', 'List installed templates')
    .argument('<resource>', 'scaffolds or recipes', ['scaffolds', 'recipes'])
    .action(manageList);

  prog
    .command('resource install', 'Install new template')
    .argument('<resource>', 'scaffold or recipe', ['scaffold', 'recipe'])
    .argument('<url>', 'Url of the template to install')
    .option('--as <name>', 'Optional name for the template')
    .action(manageInstall);

  prog
    .command('resource remove', 'Uninstall template')
    .argument('<resource>', 'scaffold or recipe', ['scaffold', 'recipe'])
    .argument('<name>', 'name of the template to uninstall')
    .action(manageRemove);

  prog
    .command('resource update', 'Update template to remote ')
    .argument('<resource>', 'scaffold or recipe', ['scaffold', 'recipe'])
    .argument('<name>', 'name of the template to update')
    .action(manageUpdate);
};
