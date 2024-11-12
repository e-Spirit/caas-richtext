/**
 * This file contains function to show how an actual renderer
 * could work with the new proposed rich text format.
 * A productive rich text renderer would be more complex, but could use the same architecture.
 */
export function renderDocument(document: RichTextContainer) {
    document.entries.forEach(entry => renderParagraph(entry, document))
}

function renderObj(obj: unknown, richTextRoot: RichTextContainer) {
    if (!hasNodeType(obj)) {
        if (typeof obj == "string") {
            // render simple string
            console.log(obj)
        } else {
            console.warn("I cannot render this!?" + obj)
        }
    } else {
        switch((obj as RichTextNode).nodeType) {
            case "paragraph": {
                renderParagraph(obj as Paragraph, richTextRoot)
                break;
            }
            case "style": {
                renderStyle(obj as Style, richTextRoot)
                break;
            }
            case "linebreak": {
                // render simple line break
                console.log("<br/>")
                break;
            }
            case "link": {
                renderLink(obj as Link, richTextRoot)
                break;
            }
            case "list": {
                renderList(obj as List, richTextRoot)
                break;
            }
            case "table": {
                renderTable(obj as Table, richTextRoot)
                break;
            }
            default: {
                console.log(`unknown nodeType - can't render ${JSON.stringify(obj)}`)
                break;
            }
        }
    }
}

function hasNodeType(obj: unknown) {
    if (Array.isArray(obj)) return false
    let keys = Object.keys((obj as object));
    return keys.indexOf("nodeType") > -1;
}

function renderParagraph(paragraph: Paragraph, richTextRoot: RichTextContainer) {
    console.log("<div>")
    paragraph.content.forEach( entry => {
        renderObj(entry, richTextRoot)
    })
    console.log("</div>")
}

function renderStyle(style: Style, richTextRoot: RichTextContainer) {
    console.log("<!--")
    console.log(`style: ${JSON.stringify(style.data)}`)
    console.log("-->")
    console.log("<span>")
    style.content.forEach( entry => {
        renderObj(entry, richTextRoot)
    })
    console.log("</span>")
}

function renderLink(link: Link, richTextRoot: RichTextContainer) {
    if (link.data) {
        console.log(`<!-- data is inline, nothing to resolve -->`)
        // linkFormData contains the project specific formData of the used link template.
        // In many cases it contains rendering relevant information.
        // Developers need to parse this information.
        let linkFormData = link.data['linkFormData'];
        console.log(`<!-- ${JSON.stringify(linkFormData)} -->`)
    }
    console.log(`<a>${link.content}</a>`)
}

function renderList(list: List, richTextRoot: RichTextContainer) {
    console.log("<!--")
    console.log(`list data: ${JSON.stringify(list.data)}`)
    console.log("-->")
    console.log("<ul>")
    list.content.forEach( entry => {
        // List style data may be required for list item rendering
        renderListItem(list, entry, richTextRoot)
    })
    console.log("</ul>")
}

function renderTable(table: Table, richTextRoot: RichTextContainer) {
    console.log("<!--")
    console.log(`table data: ${JSON.stringify(table.data)}`)
    console.log("-->")
    console.log("<table>")
    table.content.forEach( row => {
        // List style data may be required for list item rendering
        console.log("<tr>")
        row.content.forEach( cell => {
            console.log("<td>")
            cell.content.forEach(entry => renderObj(entry, richTextRoot))
            console.log("</td>")
        })
        console.log("</tr>")
    })
    console.log("</table>")
}

function renderListItem(list: List, item: ListItem, richTextRoot: RichTextContainer) {
    console.log("<!--")
    console.log(`listitem data: ${JSON.stringify(item.data)}`)
    console.log("-->")
    console.log("<li>")
    item.content.forEach( entry => {
        renderObj(entry, richTextRoot)
    })
    console.log("</li>")
}