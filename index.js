#!/usr/bin/env node

const prog = require('caporal');

const scaffold = require('./lib/scaffold');

prog
  .command('scaffold', 'Create file tree according to the template')
  .argument('<template>', 'Template to use')
  .option('--override', 'Write over existing files')
  .action(scaffold);

prog.parse(process.argv);
