/**
 *      execute: npm run build-and-run
 *
 *      exampleRichText is representing the rendered CAAS output of a CMS_INPUT_DOM component
 *      It could come from a JSON.parse() call
 *      see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
 *
 *
 *      This file, parses the new proposal for a rich text format.
 *      It also simulates a rudimentary renderer by printing some values.
 *      Required types are located in ParserTypes.ts
 */

import exampleRichText from './example-complex-richtext-inline-links.json'
import {renderDocument} from './renderer'
const inputDom: InputDom = exampleRichText.pt_domtest

console.log("Classic FirstSpirit rendered rich text format can be hard to parse:")
console.log(inputDom.value)

console.log("New proposal for rich text format is much easier to process: ")
renderDocument(inputDom.richText)