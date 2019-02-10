---
layout: content
title: Getting Started
permalink: /tutorial/
---

# A quick example

[Markdown](https://guides.github.com/features/mastering-markdown/) is a simple and efficient format to write academic documents. It can easily handle citations, images, equations, and cross referencing. Moreover, as a pure text format, you can edit it with any editor (eg. [Atom](https://atom.io/)) and it plays well with versioning tools.

To quick start your project, you can ask pandemic to prepare a boilerplate for you:

```sh
pandemic scaffold demo
```

Check [here]({{ site.baseurl }}/scaffolding/) to see how you can define your own scaffolding boilerplates.


Once you have edited your `manuscript.md` file you can simply generate a publication ready document:

```sh
pandemic publish manuscript.md
```

Voilà! You now have in the `_public` folder a compiled version of your manuscript.

# Help

To list all the actions Pandemic responds to:

```sh
pandemic --help
```

# Output format

You can export your document to any format supported by [Pandoc](https://pandoc.org/): .docx, .html, .tex, etc.

By default, pandemic will export to .pdf format.
You can easily override this default when calling pandoc, eg.:

```sh
pandemic publish manuscript.md --format docx
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
pandemic publish manuscript.md --to eisvogel
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

You can insert references in your markdown document using the [markdown citation syntax](https://rmarkdown.rstudio.com/authoring_bibliographies_and_citations.html#citations). By default, Pandemic will look for a `bibliography.bib` bib file in the source folder to parse the references. You can however override this default by specifying the relative path to you .bib files in the front-matter:

```yaml
---
bibliography: myReferences.bib
---
```

You can also provide multiple .bib files if needed:

```yaml
---
bibliography:
  - myReferences.bib
  - ../shared/references.bib
---
```

**Example**

**_manuscript.md_**
```
As demonstrated by @doe2018, ...
# References
```

**_bibliography.bib_**
```
@article{doe2018,
  author={Doe, John},
  year={2018},
  title={A fantastic paper}
}
```

Will generate using pandemic:

**_manuscript.pdf_**
```
As demonstrated by Doe (2018), ...

References
Doe, John. 2018. “A Fantastic Paper.”
```

# Cross referencing

Pandemic automatically extend the classical markdown syntax with [crossref](https://lierdakil.github.io/pandoc-crossref/#syntax) syntax. This allow you to give labels to image, equations, tables, etc. When then referencing those labels, Pandemic will replace the labels by properly numbered references, eg.:

```markdown
![A meaningfull legend](figures/barGraph1.jpg){#fig:barGraph1}

See figure @fig:barGraph1.
```

Will produce a document with the figure barGraph1.jpg titled "Figure 1" and a text saying `See figure 1.`

You will find more example in the demo (see above) and on the crossref](https://lierdakil.github.io/pandoc-crossref/#syntax) website.

# Mustache

You can use [Mustache](https://mustache.github.io/mustache.5.html) templating in your document. You simply need to specify one or multiple .json or .yaml files which contain the data to be parsed, and Pandemic will automatically take care of it. By default, Pandemic will also look for a `results.json` file in the same directory as the compiled document and try to mustache it. You can however override this default in the front-matter of your document:

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

**Example**

**_manuscript.md_**

{% raw %}
```
There was an effect ($\beta$ = {{ exp1.beta }}, p = {{ exp1.pvalue }}).
```
{% endraw %}

**_results.json_**
```json
{
  "exp1": {
    "beta": 2.80,
    "pvalue": 0.036
  }
}
```

Will generate using pandemic:

**_manuscript.pdf_**

<div class="language-json highlighter-rouge"><pre class="highlight"><code>There was an effect of treatment (&beta;  = 2.80, p = 0.036).
</code></pre></div>
