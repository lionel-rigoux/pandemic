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
# Conversion using pandoc recipes
pandemic publish --to eisvogel
pandemic publish --to tufte
```

## Mindset

Less is more:
- content, only the content, is stored in the project
- all the templates and processing scripts are manage by pandemic, out of sight

Convention over configuration:
- scaffolding creates a canonical structure
- publishing relies on this structure to keep configuration to the strict minimum

Agile:
- easy to update with npm
- customizable with homemade templates


## Roadmap

- [x] propose publishing templates
- [ ] include pandoc filters in the publishing pipeline
- [ ] possibility to add custom scaffolds and publishing recipes from git (like in [scaffold-it](https://github.com/solid-stack/scaffold-it))
- [ ] add pandoc binaries as dependencies (like in [pandoc-bin](https://github.com/toshgoodson/pandoc-bin))
- [ ] Provide tools to process revisions and suggestions (diff display, selective merge, etc.), maybe, one day

## Requirements
- npm (easy peasy with nvm)
- git
- Pandoc
- LaTeX

## Copyright
Dr. Lionel Rigoux, lionel.rigoux@sf.mpg.de (C) 2017 Max Planck Institute for Metabolism Research, Cologne
