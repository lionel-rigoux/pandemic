# pandemic

**Simplified academic writing using Pandoc.**

Pandoc is a great tool for academic writing.
Pandemic is a suite of command line tools based on Pandoc to help you automatize
 your writing pipeline so you can focus on the content:

- start a project in an eye-blink with your favorite boilerplate
- format and export your manuscript using a clean template
- manage and share templates with other users


## Install

```bash
npm install -g  pandemic
```

You will also need to install [Pandoc](https://github.com/jgm/pandoc/releases) (v2.1.1 or above) and [LaTeX](https://www.latex-project.org/get/) if it's not already the case.

## Basics

Markdown is a simple and efficient format to write academic documents. It can easily handle citations, images, equations, and cross referencing. Moreover, as a pure text format, it plays well with versioning tools and is inherently cross-platform.

```bash
# Find a cosy place
cd my-new-project

# Create boilerplate, eg. for a new paper:
pandemic scaffold manuscript

# Convert to publication ready document
pandemic publish

# Get some info to go further
pandemic help
pandemic help <command>
```

> You can export to other formats eg. Word using the option: `--format docx`

### Bibliography

By default, Pandemic will look for a `bibliography.bib` file in the same directory as the compiled document to parse citations. If you need to use a custom library, you can specify the (relative) path to the .bib file(s) in the YAML header of your markdown document:

```yaml
---
bibliography: myReferences.bib
---
```

You can also provide multiple bibfiles if needed:

```yaml
---
bibliography:
  - myReferences.bib
  - ../shared/references.bib
---
```

### Mustache

You can use [Mustache](https://mustache.github.io/mustache.5.html) templating in your document. You simply need to specify one or multiple json or yaml files which contain the data to be parsed, and Pandemic will automatically take care of it. By default, Pandemic will also look for a `results.json` file in the same directory as the compiled document and try to mustache it.

```yaml
---
mustache: myResults.json
---
```

or

```yaml
---
mustache:
  - myResultsA.yaml
  - myResultsB.json
---
```

### Use publishing recipes

The best part with Markdown is that, using Pandoc, your documents can be directly exported to .pdf or .docx following specific formatting guidelines (eg. citation style, line spacing) specified by template. Need to reformat a manuscript for a different journal? Just select another template!

Pandemic is there to manage all you exporting templates and facilitate the configuration of Pandoc options and filters so you can focus on the content and forget about the formatting pipeline.

You can install publishing recipes directly from user contributed repos.
Pandemic will look for `recipe.<format>.json` instruction file (see below), but will otherwise try to guess which files can serve as a template.

For example, install a new recipe:

```bash
pandemic resource install recipe --as eisvogel https://github.com/Wandmalfarbe/pandoc-latex-template
```

You can then compile your manuscript using the new template:

```bash
pandemic publish --to eisvogel
```

Note that you can also specify the recipe and format directly in the YAML frontmatter of your markdown document:

```YAML
---
pandemic:
  recipe: eisvogel
---
```

### Recipe instruction

By default, Pandemic will use a standard set of filters and Pandoc options that should cover the usual needs for manuscript publication (citations, etc.). You can display the defaults using the option `--verbose` when publishing.

You can override the default behavior of pandemic and explicitly defines how your template should be compiled. You just have to include a file `recipe.<format>.json` in your recipe folder defining the options, variable, and filters to pass to Pandoc. For example, if you want to use a custom title page with the Eisvogel template:

`~/.pandemic/recipe/eisvogel/recipe.pdf.json`
```json
{
  "options":  [
        "-V titlepage=true",
        "-V titlepage-color='D8DE2C'"
  ]
}
```

The `recipe.<format>.json` file can have the following entries. Missing values will be automatically replaced by the default.

- *template*
  ```json
  {
    "template": "./path/to/entry-point.tex",
  }
  ```

  Relative path to the template file (as in `pandoc --template='path to template'`). As Pandemic will load the .json file corresponding to the `--format` option, this field is useful is the same recipe can be used to publish in different formats.

- *options*
  ```json
  {
    "options": [
      "-V pandocVariable=pandocValue",
      "--pandocOption"
      ]
  }
  ```

  String or array of string to pass as options to Pandoc.

- *filters*
  ```json
  {
    "filters": [
      "pandoc-eqnos",
      "myCustomFilter"
      ]
  }
  ```

  Array of filter names to pass to Pandoc (see `pandoc --filter=<filterName>`). Note that this entry will override the defaults and you will have to explicitly list pandoc-xnos filters if you need them.

### Managing recipes

List installed recipes:

```bash
pandemic resource list recipes
```

Update recipe from remote repo:

```bash
pandemic resource update recipe <recipe>
```

Delete existing recipe from local storage:

```bash
pandemic resource remove recipe <recipe>
```

## Scaffolding

Scaffolding allows you to create a tree of folders and files that can serve as a starting point for a new project. Scaffolding is a good way to enforce structural consistency across projects. It can also help you save a lot of time by avoiding repeated copy/pasting from previous projects in the initial setup.

```bash
pandemic scaffold <template>
```

### Managing scaffolds

The arborescence of folders and boilerplate files created by scaffolding relies on "scaffolds" (scaffolding templates) installed through pandemic. Scaffolding will simply copy all the files from the template in your current directory.

To see the available scaffolds:

```bash
pandemic resource list scaffolds
```

Using shared scaffolds is a good way to harmonize the structure of the projects in your team.
You can install new scaffolds by cloning on your local computer a git repository that contains the scaffolding template:

```bash
pandemic resource install scaffold https://github.com/user/template-repo.git
```

> By default, the new scaffold will be stored as <template-repo>. You can override this behavior and specify a custom name using `--as <template-name>`

Note that if the remote repo is updated, you can update your local copy of the scaffold using:

```bash
pandemic resource update scaffold <template>
```

You can also remove an unused scaffold:

```bash
pandemic resource remove scaffold <template>
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

## Requirements

### Node & npm

The best way to do this is to use [nvm](https://github.com/creationix/nvm).

**TL;DR:**

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
source ~/.bashrc
nvm install --lts
```

### pandoc ^2.1.1

Go to the [Pandoc website](https://github.com/jgm/pandoc/releases), download the installer for your system, run the installer.

> Future versions of Pandemic will include pandoc binaries to avoid compatibility issues.

Pandemic relies on pandemic-citeproc, which should installed along with pandoc. Pandemic also includes a copy of the following filters, in case you don't already have them:

- [pandoc-fignos 1.3](https://github.com/tomduck/pandoc-fignos)
- [pandoc-eqnos 1.3](https://github.com/tomduck/pandoc-eqnos)
- [pandoc-tablenos 1.3](https://github.com/tomduck/pandoc-tablenos)

### LaTeX

This is needed to compile documents to pdf. See [here](https://www.latex-project.org/get/) to get the binaries.

### git

Well, I hope you already have this one installed!

## Roadmap

- [x] propose publishing templates
- [x] include pandoc filters in the publishing pipeline
- [x] possibility to add custom scaffolds and publishing recipes from git
- [x] add possibility in recipes ~for pre and~ post publishing hooks
- [ ] automated image management to facilitate publication (extraction, reformating, isolated legends, etc)
- [ ] provide tools to process revisions and suggestions (diff display, selective merge, etc.)?
- [ ] add pandoc binaries as dependencies (like in [pandoc-bin](https://github.com/toshgoodson/pandoc-bin))

## Copyright
Lionel Rigoux, lionel.rigoux@gmail.com (C) 2018
