import {expect, test} from '@jest/globals';
import {getRenderedDocument} from '../renderer'
import ulInSpanTestDocument from './fixtures/ul-in-span.json'

describe('Example HTML renderer', () => {
    const documentStartBoilerplate = `<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><title>Title</title></head><body>`
    const documentEndBoilerplate = `</body></html>`

    function cleanString(str: String): String {
        return str.trim().replace(/\s/g, "")
    }

    test('Element <ul> should not be allowed as child of element <span>', () => {
        let testJson = ulInSpanTestDocument.pt_test.richText;
        const testResult = getRenderedDocument(testJson)
        let expectedResult = documentStartBoilerplate + `
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
        ` + documentEndBoilerplate
        expect(cleanString(testResult)).toBe(cleanString(expectedResult))
    })
})