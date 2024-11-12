/**
 *      execute: npm run build-and-run
 *
 *      This folder contains an example parser for the proposed richText format.
 *      It parses the default "classic" format to a JSON object, that can be used inside a frontend app.
 */

import complexRichText from '../example-complex-richtext-inline-links.json'
import { parseDefaultRichText } from './parser'

const inputDom = complexRichText.pt_domtest

let parsedRichText = parseDefaultRichText(inputDom.value)
console.log(JSON.stringify(parsedRichText, null, 2))