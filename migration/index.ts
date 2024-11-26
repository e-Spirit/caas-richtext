/**
 *      execute: npm run run-migrator
 *
 *      This folder contains an example migrator for the proposed richText format.
 *      It parses the default "classic" format to a JSON object, transforms it, and then it has
 *      the proposed (new) rich text format, that can be used inside a frontend app.
 */

import complexRichText from '../example-complex-richtext-inline-links.json'
import { migrateDefaultRichText } from './migrator'

const inputDom = complexRichText.pt_domtest

let migratedRichText = migrateDefaultRichText(inputDom.value)
console.log(JSON.stringify(migratedRichText, null, 2))
