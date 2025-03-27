# CaaS RichText
FirstSpirit editors can manage their rich text in FirstSpirit's _CMS_INPUT_DOM_ components.
This repository contains conceptual files and drafts that belong to the rich text format in FirstSpirit's headless solution (CaaS).
The rich text format is meant to extend the existing data of _CMS_INPUT_DOM_ components in CaaS, so in order to understand this repository and its files it is helpful to be familiar with the CaaS format.
Good starting point is the `./index.ts`. 

## Some core ideas
The default format is a proprietary XML format, that can be hard to work with, especially if it contains links. 
So in most projects customers/partners implement a solution to transform this the default format to a better fitting format.

The following is an excerpt of our suggestion for a better fitting format.
You can find the complete example [here](example-complex-richtext-inline-links.json).

```json
{
  "pt_domtest": {
    "fsType": "CMS_INPUT_DOM",
    ...
    "richText": {
      "entries": [
        {
          "nodeType": "paragraph",
          "data": {
            "data-fs-style": "format.h3"
          },
          "content": [
            "This is a ",
            {
              "nodeType": "style",
              "data": {
                "data-fs-style": "format.custom_yellow_text"
              },
              "content": [
                "STYLED"
              ]
            },
            "HEADLINE"
          ]
        },
        ...
      ]
    }
  }
}
```

In our proposal for a better rich text format we came up with following ideas:

* The new format should be reachable on the JSON of the component in a separate object (named “richText”)
* Each richText document consists of an array of paragraphs (named “entries”)
* Each paragraph is a RichTextNode
* Each RichTextNode has a “nodeType”, which can be read by a JSON consuming renderer to determine how the node should be rendered
* Optionally, RichTextNodes have a “data” object, which can contain style information and other render details
* For the nodeType “link”, the “data” object also contains the link formData. ("data.linkFormData")
* FirstSpirit "default" styles/format templates (like bold/italic) should always be present (e.g. via data-fs-style entry) in data / Custom format templates should not be treated differently.
* Optional on RichTextNodes is the “content” array, which represents the content contained in the node depending on the type
* Plain text is the only content that is not additionally wrapped within an object with nodeType, which makes the format more readable. (A `“nodeType”: “text”` would be conceivable)
* linebreaks have no further content and no additional render information, so they are represented by objects with the single field “nodeType”: “linebreak”
* required nodeTypes: "paragraph" | "style" | "link" | "list" | "listItem" | "table" | "tableRow" | "tableCell"
* Further type information can be determined from types.ts
* Any qualified solution idea requires at least a .json file, showing an example of the format for all possible node "types" in FirstSpirit rich text:
  * paragraph
  * style
  * link
  * list
  * listItem
  * table
  * tableRow
  * tableCell
  * plainText
  
## Parsing
An example migrator for the default "classic" format can be found in the _"migration"_ folder

## Feedback & Contribution
We know a new version of the rich text format is a hot topic, and we are happy to discuss any feedback given. 
The best way to submit your feedback are GitHub issues. 
[Create GitHub issue](https://github.com/e-Spirit/caas-richtext/issues/new/choose)

If you are willing to contribute, you may always fork the repository and submit merge requests. 

## Disclaimer
This repository is provided for information purposes only. 
Crownpeak Technology may change the contents hereof without notice. 
This repository is not warranted to be error-free, nor subject to any other warranties or conditions, whether expressed orally or implied in law, including implied warranties and conditions of merchantability or fitness for a particular purpose. 
Crownpeak Technology specifically disclaims any liability with respect to this repository and no contractual obligations are formed either directly or indirectly by this repository. 
The technologies, functionality, services, and processes described herein are subject to change without notice.

## Legal Notices

CaaS RichText is a property of [Crownpeak Technology GmbH](https://www.crownpeak.com/homepage), Dortmund, Germany.
CaaS RichText is subject to the Apache-2.0 license.
