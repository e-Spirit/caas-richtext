/**
 * This file contains functions to show how an actual HTML renderer
 * could process the new proposed rich text format.
 * A productive rich text renderer would be more complex, but could use the same architecture.
 */

export function getRenderedDocument(document: RichTextContainer): string {
    // html boilerplate
    let result = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<title>Title</title>\n</head>\n<body>\n`

    // actual content
    result += document.entries.map(entry => renderParagraph(entry)).join("\n")

    // further html boilerplate
    return result + `</body>\n</html>`
}

function renderObj(obj: unknown): string {
    if (!hasNodeType(obj)) {
        if (typeof obj == "string") {
            // render simple string
           return obj + "\n"
        } else {
            console.warn("I cannot render this: " + obj)
        }
    } else {
        switch((obj as RichTextNode).nodeType) {
            case "paragraph": {
                return renderParagraph(obj as Paragraph)
            }
            case "style": {
                return renderStyle(obj as Style)
            }
            case "linebreak": {
                // render simple line break
                return "<br/>" + "\n"
            }
            case "link": {
                return renderLink(obj as Link)
            }
            case "list": {
                return renderList(obj as List)
            }
            case "table": {
                return renderTable(obj as Table)
            }
            default: {
                console.log(`unknown nodeType - cannot render ${JSON.stringify(obj)}`)
                return ""
            }
        }
    }
    return "" // empty default
}

function renderParagraph(paragraph: Paragraph): string {
    let result = "<div>" + "\n"
    paragraph.content.forEach( entry => {
        result += renderObj(entry)
    })
    return result + "</div>" + "\n"
}

function renderStyle(style: Style): string {
    let result = "<!--" + "\n"
    result += `style: ${JSON.stringify(style.data)}` + "\n"
    result += "-->" + "\n"
    result += "<div>" + "\n" // <span> - tags do not allow block-level elements as children
    style.content.forEach( entry => {
        result += renderObj(entry)
    })
    return result + "</div>" + "\n"
}

function renderLink(link: Link): string {
    let result = ""
    if (link.data) {
        result += `<!-- data is inline, nothing to resolve -->` + "\n"
        // linkFormData contains the project specific formData of the used link template.
        // In most cases it contains rendering relevant information.
        // Developers need to parse this information.
        let linkFormData = link.data['linkFormData'];
        result += `<!-- ${JSON.stringify(linkFormData)} -->`+ "\n"
    }
    return result + `<a>${link.content}</a>` + "\n"
}

function renderList(list: List): string {
    let result = "<!--" + "\n"
    result += `list data: ${JSON.stringify(list.data)}` + "\n"
    result += "-->" + "\n"
    result += "<ul>" + "\n"
    list.content.forEach( entry => {
        // List style data may be required for list item rendering
        result += renderListItem(list, entry)
    })
    return result + "</ul>" + "\n"
}

function renderTable(table: Table): string {
    let result = "<!--" + "\n"
    result += `table data: ${JSON.stringify(table.data)}` + "\n"
    result += "-->" + "\n"
    result += "<table>" + "\n"
    table.content.forEach( row => {
        // List style data may be required for list item rendering
        result += "<tr>" + "\n"
        row.content.forEach( cell => {
            result += "<td>" + "\n"
            cell.content.forEach(entry => result += renderObj(entry))
            result += "</td>" + "\n"
        })
        result += "</tr>" + "\n"
    })
    return result + "</table>" + "\n"
}

function renderListItem(list: List, item: ListItem): string {
    let result = "<!--" + "\n"
    result += `listitem data: ${JSON.stringify(item.data)}` + "\n"
    result +="-->" + "\n"
    result +="<li>" + "\n"
    item.content.forEach( entry => {
        result += renderObj(entry)
    })
    return result + "</li>" + "\n"
}

function hasNodeType(obj: unknown) {
    if (Array.isArray(obj)) return false
    let keys = Object.keys((obj as object));
    return keys.indexOf("nodeType") > -1;
}
