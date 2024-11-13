import {ValidationError, XMLParser, XMLValidator} from "fast-xml-parser"
import {transformResult} from "./transformer";

export function migrateDefaultRichText(defaultRichText: string) {
    // the parsed result is already a usable JSON object
    const parsedResult = parseXML(defaultRichText)
    const stringifiedResult = JSON.stringify(parsedResult, null, 2)

    // the output formats readability can be improved by the optional reformatting
    return transformResult(stringifiedResult)
}

// these constants might need further additions
const exclusiveParagraphTags= ["p", "pre"]
const exclusiveStyleTags= ["b", "i", "u"]

function parseXML(defaultFormattedRichText: string, parsingOptions = {
    preserveOrder: true, // order is important, otherwise, the format would merge nodes
    ignoreAttributes: ["type"], // we need attributes for the 'data'-object, but the type attribute is useless
    attributeNamePrefix : "", // removes prefix
    processEntities: false, // we don't have default and DOCTYPE entities, so we can disable them
    ignorePiTags: true, // we don't use pi tags, so we can ignore them
    textNodeName: "text", // text nodes should use key "text"
    stopNodes: ["*.script"], // we don't want to parse link form data here (we'll do this later)
    updateTag: tagUpdater, // replace HTML tags with render agnostic node type names
}) {
    let valid = XMLValidator.validate(defaultFormattedRichText);
    if (!valid) throw valid as ValidationError
    let parser = new XMLParser(parsingOptions)
    return parser.parse(defaultFormattedRichText);
}


/**
 * This method enforces the fitting tagName on all nodes (with correct fs-data-style attribute).
 * example: every <b> tag should be a "style" tag with data = {"data-fs-style": "format.b"}
 */
const tagUpdater = (tagName: string, jPath: string, attrs: {[k: string]: string}) => {
    if (tagName === "a") return "linkText"
    if (tagName === "br") return "linebreak"
    if (tagName === "li") return "listItem"
    if (tagName === "td") return "tableCell"
    if (tagName === "tr") return "tableRow"
    if (tagName === "script") return "linkFormData"

    /*  To distinguish ordered lists and unordered lists,
        it is possible to additionally check for a certain data-fs-style attribute in the if condition,
        that tells the list items to be ordered.
    */
    if (tagName === "ul") return "list"

    // tagName is included in list of exclusive paragraph tags
    if (exclusiveParagraphTags.indexOf(tagName) > -1) {
        // add "format." prefix to style attribute (like on customer specific format templates)
        attrs["data-fs-style"] = "format."+tagName
        return "paragraph"
    }

    // tagName is included in list of exclusive style tags
    if (exclusiveStyleTags.indexOf(tagName) > -1) {
        // add "format." prefix to style attribute (like on customer specific format templates)
        attrs["data-fs-style"] = "format."+tagName
        return "style"
    }

    // "div"s can represent multiple node types
    if (tagName === "div") {
        // let's find the correct node type by searching for identifying style or type attributes
        const attributeObjectExists = attrs && typeof attrs === 'object'
        if (attributeObjectExists) {
            if (isTopLevelElement(jPath))
                return "paragraph"
            if (containsLinkType(attrs as object))
                return "link"
            else // if it's neither paragraph nor link, it has to be a style node
                return "style"
        }
    }
    return tagName
}

// helper functions
const containsLinkType =  (data: object) => {
    return Object.entries(data).some(([key, value]) => {
        const hasDataFsTypeAttribute = key === "data-fs-type";
        const attributeStartsWithLink = (value as string).startsWith("link.");
        return hasDataFsTypeAttribute && attributeStartsWithLink
    })
}
const isTopLevelElement = (jpath: string): boolean => {
    // a dependency to jsonpath could solve this better, but this solution is quicker
    return !jpath.includes(".") // idea: 'p.div' is not topLevelElement, while 'div' is
}
