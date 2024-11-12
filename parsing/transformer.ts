/**
 * This function transforms the given stringified json object to a reformatted and easier to use json object.
 * @param stringifiedResult the string has to be stringified result of parser.parseDefaultRichText()
 */
export function transformResult(stringifiedResult: string) {
    return JSON.parse(stringifiedResult, (key, value) => {

        if (isLineBreakObject(value)) {
            // remove unnecessary complexity of line breaks
            return {"nodeType": "linebreak"}
        }

        if (isLinkObject(value)) {
            const linkDataObject = value[":@"];
            let rawLinkFormData = value["link"][0]["linkFormData"][0];
            linkDataObject.linkFormData = parseLinkFormData(rawLinkFormData)
            const unwrappedLinkText = value["link"][1]["linkText"][0];
            // move link form data to the data object and unwrap the link text
            return {
                "nodeType": "link",
                "data": linkDataObject,
                "content": unwrappedLinkText
            }
        }

        if (isTextObject(value)) {
            // unwrap text objects
            return value.text
        }

        // transform 'regular' objects
        if (isAttributesObject(value)
            || isListObject(value)
            || isListItemObject(value)
            || isTableObject(value)
            || isTableRowObject(value)
            || isTableCellObject(value)
        ) {
            // The nodeType is easier to read, when it's a value and not a key.
            // Accordingly, the value of the old key has to be moved to a named key (i.e. "content").
            return {
                "nodeType": Object.keys(value)[0],
                "data": value[":@"],
                "content": Object.values(value)[0]
            }
        }
        return value
    })
}

// parsing link form data is always customer specific - This is just an example how it can be done!
function parseLinkFormData(stringifiedFormData: string) {
    return JSON.parse(stringifiedFormData, (key, value) => {
        if (key === "CMS_INPUT_DOM" || key === "CMS_INPUT_DOMTABLE") {
            // a customer could use parser.parseDefaultRichText() to recursively parse even deep nested rich text
            return JSON.stringify(value)
        }
        return value
    })
}

// helper functions
const isTextObject = (value: any) => {
    return typeof value == 'object' && Object.keys(value)[0] === "text";
};

const isAttributesObject = (value: any) => {
    return typeof value == 'object' && Object.keys(value).includes(":@");
};

const isLinkObject = (value: any) => {
    return typeof value == 'object' && Object.keys(value)[0] === "link";
};

const isLineBreakObject = (value: any) => {
    return typeof value == 'object' && Object.keys(value)[0] === "linebreak";
};

const isListItemObject = (value: any) => {
    return typeof value == 'object' && Object.keys(value)[0] === "listItem";
};

const isListObject = (value: any) => {
    return typeof value == 'object' && Object.keys(value)[0] === "list";
};
const isTableObject = (value: any) => {
    return typeof value == 'object' && Object.keys(value)[0] === "table";
};

const isTableRowObject = (value: any) => {
    return typeof value == 'object' && Object.keys(value)[0] === "tableRow";
};

const isTableCellObject = (value: any) => {
    return typeof value == 'object' && Object.keys(value)[0] === "tableCell";
};