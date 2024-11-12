interface InputDom {
    value: string
    richText: RichTextContainer
}

interface RichTextContainer {
    entries: Paragraph[]
}

interface RichTextNode {
    nodeType: "paragraph" | "style" | "link" | "list" | "listItem" | "table" | "tableRow" | "tableCell" | string;
}

interface GenericData {
    data?: {
        [key: string]: string | object
    }
}

interface Paragraph extends GenericData, RichTextNode {
    content: (RichTextNode | string)[]
}

interface Style extends GenericData, RichTextNode {
    content: (RichTextNode | string)[]
}

interface Link extends GenericData, RichTextNode {
    content: string
}

interface List extends GenericData, RichTextNode {
    content: ListItem[]
}
interface ListItem extends GenericData, RichTextNode {
    content: (RichTextNode | string)[]
}

interface Table extends GenericData, RichTextNode {
    content: TableRow[]
}

interface TableRow extends GenericData, RichTextNode {
    content: TableCell[]
}

interface TableCell extends GenericData, RichTextNode {
    content: (RichTextNode | string)[]
}