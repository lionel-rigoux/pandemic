const prog = require('caporal')
const manageList = require('./manage-list.js')
const manageInstall = require('./manage-install.js')

module.exports = () => {
  prog
    .command('resource list', 'List installed templates')
    .argument('<resource>', 'scaffolds or recipes', ['scaffolds','recipes'])
    .action(manageList)

prog
  .command('resource install', 'Install new templates')
  .argument('<resource>', 'scaffold or recipe', ['scaffold','recipe'])
  .argument('<url>', 'Url of the template to install')
  .option('--as <name>', 'Optional name for the template')
  .action(manageInstall)
}
