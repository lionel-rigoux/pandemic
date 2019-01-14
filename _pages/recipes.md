---
layout: content
title: Style with recipes
permalink: /recipes/
---

# What is a pandemic recipe?

When you publish your document with pandemic, you can instantly change the  style of the output by using a _recipe_. Need to reformat a manuscript for a different journal with different guidelines, citations styles ..? Just select another recipe!

In practice, a _recipe_ is a set of files and instructions that pandemic will use is to that contains all the informations needed to style a document. To nudge pandemic users to share their templates, a recipe must be installed from a git repository. For example:

```bash
pandemic resource install recipe --as eisvogel https://github.com/Wandmalfarbe/pandoc-latex-template
```

You can then compile your manuscript using the new template:

```bash
pandemic publish manuscript.md --to eisvogel
```

Note that you can also specify the recipe and format directly in the YAML front-matter of your markdown document:

```yaml
---
pandemic:
  recipe: eisvogel
---
```

# Managing recipes

- List installed recipes:

```bash
pandemic resource list recipes
```

- Install a new recipe:

```bash
pandemic resource install recipe [--as <recipeName>] <recipeURL>
```

By default, the recipe name will be the name of the repo. You can override this default using the `--as <name>` option.

- Update recipe from remote repo:

```bash
pandemic resource update recipe <recipeName>
```

- Delete existing recipe from local storage:

```bash
pandemic resource remove recipe <recipeName>
```

If you curious, you can look in the `.pandemic` folder in your home directory. All the recipes are simply cloned there.

# Creating your own recipe

By default, Pandemic will use a standard set of template, filters, and options that should cover the usual needs for manuscript publication (citations, etc.). You can display the details of what pandemic exactly does by using the option `--verbose` when publishing.

A recipe is a set of files and instructions you can use to modify part or all of those default behaviors. The sections below describe point by point how you can tweak pandemic to concoct the perfect document.

## Recipe instructions

The first thing pandemic will look for in the recipe folder is a _recipe instructions_ file named `recipe.<format>.json`where `<format>` is the extension of the compiled document.

If only one instruction file is found, pandemic will automatically guess the output format. You can also decline your recipe in multiple 'flavors'. For example, in addition to a `recipe.pdf.json`, you could also have a `recipe.draft.pdf.json` that will use slightly different options for the compilation. In that case, you will need to specify the output format (see [here]({{site.baseurl}}/tutorial/#output-format)), i.e. `pdf` or `draft.pdf`, when publishing your document.

The recipe instruction file must be written in JSON and can specify any combination of the entries described below.

## Template file

Pandemic is build on [pandoc](https://pandoc.org), and therefore can make use of any pandoc template.
A template is basically a boilerplate with placeholders for the content of the document you want to compile.
If you're new to this, you can first have look at the [pandoc default templates](https://github.com/jgm/pandoc-templates) or this list of [user contributed templates](https://github.com/jgm/pandoc-templates) and tweaks those templates to your need.
You can also check the dedicated [pandoc manual](https://pandoc.org/MANUAL.html#templates).
With a bit of training, you will be able to convert any existing .tex, .html, .docx, ... document you like into a pandoc template that you can reuse indefinitely to style your markdown document.

Once you have your template, just provide its path (relative to the instructions file, ie. the root of the recipe folder) in the instructions:

```json
{
  "template": "./eisvogel.tex",
}
```

Note that if no template is given, pandoc will try to guess if a file in the recipe folder could be a good candidate, or fall back to the default pandoc template.



## Pandoc options

Pandoc can be configured with a lot of different general and format specific [options](https://pandoc.org/MANUAL.html#options). In order to use those options in pandemic, you need to list them in the recipe instruction file as a single string or an array of strings with the `options` label.

For example, if you want to use a custom title page with the [eisvogel recipe](https://github.com/Wandmalfarbe/pandoc-latex-template) we installed above, you could create a `recipe.pdf.json` file in the `~/.pandemic/recipe/eisvogel/` folder with the following content:

```json
{
  "options":  [
        "-V titlepage=true",
        "-V titlepage-color='D8DE2C'"
  ]
}
```

## Pandoc filters

Filters are plugins that extend the functionalities of pandoc. Pandemic includes [pandoc-eqnos](https://github.com/tomduck/pandoc-eqnos), [pandoc-fignos](https://github.com/tomduck/pandoc-fignos), and [pandoc-tablenos](https://github.com/tomduck/pandoc-tablenos) and applies them by default. Those filters allows to cross-reference equations, figures, and tables.

If you want to use a different set of filters, for example from [this list](https://github.com/jgm/pandoc/wiki/Pandoc-Filters), simply provide their name in the instruction file:

```json
{
  "filters":  [
        "pandoc-placetable",
        "pandoc-fignos"
  ]
}
```

Specifying such a list of filters will override the default xnos filters. If you still want them, you'll have to list them in the instructions. You can also provide an empty list to disable filters all together.

Please note that the respective filters need to be installed on your machine, as only the default (xnos) are provided with pandemic. If you intend to share your recipe, do not forget to mention those dependencies or find a way to include the filters within your recipe.

## Preprocessing

Finally, you might want to process the markdown document before it gets compiled by pandoc. By default, pandemic applies mustache templating via the [pandemic-mustache](https://www.npmjs.com/package/pandemic-mustache) tool.
This default can be overwritten by specifying a list of preprocessing steps in your instruction file:

```json
{
  "preprocessing":  [
        "markdown-pp"
  ]
}
```

Like for filters, this list completely override the default and you will need to explicitly list `pandemic-mustache` if you need it. Also, any software, script, or command line utility called in the preprocessing steps needs to be installed on the machine or made available in the recipe folder.

**_Writing your own preprocessor_**

Each preprocessing step can be virtually any command you want. The only constraint is that it should read the original content on `stdin` and write the modified content on `stdout`. Logging should be directed to `stderr`. Logs and each steps of preprocessing are accessible by using the `--verbose` flag when calling pandemic.

Note that each command will be run from the recipe folder. Two environment variables, `PANDOC_SOURCE_PATH` and `PANDOC_TARGET_PATH`, provide respectively the path to folder were the source (the document to compile) and the target (the compiled document) are located. Also, preprocessing commands are run via `cross-env` to help with cross-platform compatibility.
