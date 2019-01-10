---
layout: content
title: Getting Started
permalink: /tutorial/
---

# A quick example

[Markdown](https://guides.github.com/features/mastering-markdown/) is a simple and efficient format to write academic documents. It can easily handle citations, images, equations, and cross referencing. Moreover, as a pure text format, you can edit it with any editor (eg. [Atom](https://atom.io/)) and it plays well with versioning tools.

To quick start your project, you can ask pandemic to prepare a boilerplate for you:

```sh
pandemic scaffold manuscript
```

Check [here]({{ site.baseurl }}/scaffolding/) to see how you can define your own boilerplates.


Once you have edited your `manuscript.md` file you can simply generate a publication ready document:

```sh
pandemic publish
```

Voilà! You now have in the `_public` folder a compiled version of your manuscript.

# Output format

You can export your document to any format supported by [Pandoc](https://pandoc.org/): .docx, .html, .tex, etc.

By default, pandemic will export to .pdf format.
You can easily override this default when calling pandoc, eg.:

```sh
pandemic publish --format docx
```

You can also specify the desired format in the front-matter of your markdown document:

```yaml
---
pandemic:
  format: docx
---
```

# Styling

If you want to change the look of your compiled document, you will need to install `recipes` which contain a template and instructions to compile your document with a specific style. For example:

```sh
pandemic resource install recipe --as eisvogel https://github.com/Wandmalfarbe/pandoc-latex-template
```

In order to use the recipe, either specify it when calling pandemic:

```sh
pandemic publish --to eisvogel
```

Or specify the desired recipe in the front-matter of your markdown document:

```yaml
---
pandemic:
  recipe: eisvogel
---
```

You can also [create your own recipe]({{ site.baseurl }}/recipes/)!

# Bibliography

# Mustache
