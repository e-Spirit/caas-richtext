import {expect, test} from '@jest/globals';
import {getRenderedDocument} from '../renderer'
import listInStyledElementDocument from './fixtures/list-in-styled-elements.json'

describe('Example HTML renderer', () => {
    const documentStartBoilerplate = `<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><title>Title</title></head><body>`
    const documentEndBoilerplate = `</body></html>`

    test('List elements should be allowed as child of styled elements', () => {
        let testJson = listInStyledElementDocument.pt_test.richText;
        const testResult = getRenderedDocument(testJson)
        let expectedResult = documentStartBoilerplate + `
        <div>
            relevant content starts here:
            <!--
            style:{\"data-fs-style\":\"format.custom_format\"}
            -->
            <div>
                <!--
                list data: {\"data-fs-style\":\"0\",\"data-fs-property-style\":\"0\"}
                -->
                <ul>
                    <!--
                    listitem data: {\"data-fs-property-pre\":\"1\",\"data-fs-style\":\"1\"}
                    -->
                    <li>
                    list item
                    </li>
                </ul>
            </div>
        </div>
        ` + documentEndBoilerplate
        expect(cleanString(testResult)).toBe(cleanString(expectedResult))
    })

    /**
     * Creates a copy of the provided String that does not contain any whitespaces.
     * This helper function can be used to simplify HTML String comparisons.
     */
    function cleanString(str: String): String {
        return str.replace(/\s/g, "")
    }
})