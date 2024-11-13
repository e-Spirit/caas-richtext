/**
 *      execute: npm run build-and-run
 *
 *      exampleRichText is representing the rendered CAAS output of a CMS_INPUT_DOM component
 *      It could come from a JSON.parse() call
 *      see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
 *
 *
 *      This file process the new proposal for a rich text format.
 *      It also simulates a rudimentary renderer by printing some values.
 *      Required types are located in ./types.ts
 */

import exampleRichText from './example-complex-richtext-inline-links.json'
import * as fs from 'fs';
import {getRenderedDocument} from './renderer'
const inputDom: InputDom = exampleRichText.pt_domtest

console.log("Classic FirstSpirit rendered rich text format can be hard to process:")
console.log(inputDom.value)

console.log("New proposal for rich text format is much easier to work with: ")
const renderedDocument = getRenderedDocument(inputDom.richText);
console.log(renderedDocument)

const resultHtml = fs.readFileSync('./result.html','utf8').replace(/\s/g, '')
const renderedDoc = renderedDocument.replace(/\s/g, '')

console.assert(renderedDoc === resultHtml, "Content of rendered document should be equal to result.html")

