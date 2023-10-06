import { SUBJECTS } from "./subjects"

export namespace CUSTOM_DOCUMENT {
    export type Document = { querySelectorAll(query : string) : NodeElemLabel[] }
    export type NodeElemLabel = { innerText : typeof SUBJECTS[number], closest(query : string): NodeContainerElem }
    export type NodeContainerElem = { remove() : void }
} 