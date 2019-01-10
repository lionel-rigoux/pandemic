# pandemic-mustache

Wrapper to apply mustache templating to your manuscript in pandemic.

## Usage

In the front matter of document, specify a list of .json or .yaml files that contain the 'views' (ie. the name/values association to replace in the template):

```yaml
---
pandemic:
  mustache: "results.json"
---
```

or

```yaml
---
pandemic:
  mustache:
  - "results/res1.json"
  - "results/res2.yaml"
---
```

In your pandemic recipe, specify this pandemic-mustache in your list of preprocessing hooks:

```json
{
  "prehooks": [
    "pandemic-mustache"
  ]
}
```
