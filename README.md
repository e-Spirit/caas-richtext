# CaaS RichText
This repository contains conceptual files and drafts that belong to the rich text format in FirstSpirit CaaS.


Any qualified solution idea requires at least a .json file, showing an example of the format for all possible node "types" in FirstSpirit rich text:
* paragraph
* style
* link
* list
* listItem
* table
* tableRow
* tableCell
* plainText

further files, showing how the proposed format could be rendered might be helpful.

## Some core ideas

* The new format should be reachable on the JSON of the component in a separate object (named “richText”)
* Each richText document consists of an array of paragraphs (named “entries”)
* Parallel to this, there should be an array with the form data of the links contained in the document (named “domLinksFormData”)
* The form data of the links are typically project-specific and therefore extracted from the rich text document. (In the `ideas/referenced-links` there is a version of the Json which writes the LinkFormData into the RichtextDocument)
* parsing project specific links form data will (always) remain the responsibility of the customer/middleware
* Each paragraph is a RichTextNode
* Each RichTextNode has a “nodeType”, which can be read by a JSON consuming renderer to determine how the node should be rendered
* Optionally, RichTextNodes have a “data” object, which can contain style information and other render details
* For the nodeType “link”, the “data” object also contains the link formData. ("data.linkFormData")
* FirstSpirit "default" styles/format templates (like bold/italic) should always be present (e.g. via data-fs-style entry) in data. There Should not be a difference between custom format templates and FS default templates.
* Also optional on RichTextNodes is the “content” array, which represents the content contained in the node depending on the type
* Plain text is the only content that is not additionally wrapped within an object with nodeType, which makes the format more readable. (A `“nodeType”: “text”` would be conceivable)
* linebreaks have no further content and no additional render information, so they are represented by objects with the single field “nodeType”: “linebreak”
* required nodeTypes: "paragraph" | "style" | "link" | "list" | "listItem" | "table" | "tableRow" | "tableCell"
* Further type information can be determined from types.ts

## Parsing
An example parser for the default "classic" format can be found in the _"parsing"_ folder

## feedback
We know a new version of the rich text format is a well discussed topic.
Since the CaaS Team is not actually using the format in any frontend, we're happy to get feedback here.

The best way to submit feedback is the corresponding slack channel:
https://crownpeak.slack.com/archives/C07SG6RU789