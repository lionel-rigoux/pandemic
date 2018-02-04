# pandemic
CLI tool for the smart scientist

## Install
```
npm install -g  git+ssh://git@github.sf.mpg.de:lrigoux/pandemic.git
```

> Note that you need to have a proper ssh authorization to login to github.sf.mpg.de for this to work

## Usage

## Basics

```
# Find a cosy place
cd my-new-project

# Create boilerplate, eg. for a new paper:
pandemic scaffold manuscript

# Convert to publication ready document
pandemic publish
```

## Recipes

```
# Convert to publication ready document
pandemic publish --to tufte
```

## Mindset

Less is more:
- content, only the content, is stored in the project
- all the templates and processing scripts are manage by pandemic, out of sight

Convention over configuration:
- scaffolding creates a canoncial structure
- publishing relies on this structure to keep configuration to the strict minimum

Agile:
- easy to update with npm
- customizable with homemade templates


## Roadmap

- propose publishing templates
- include pandoc filters in the publishing pipeline
- possibility to add custom scaffolds and publishing templates (recipes) from git
- add pandoc binaries as dependencies (or not, I don't know yet)
- Provide tools to process revisions and suggestions (diff display, selective merge, etc.)

## Requirements
- npm (easy peasy with nvm)
- git
- Pandoc
- LaTeX

## Copyright
Dr. Lionel Rigoux, lionel.rigoux@sf.mpg.de (C) 2017 Max Planck Institute for Metabolism Research, Cologne
