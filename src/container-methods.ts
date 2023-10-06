import { CUSTOM_DOCUMENT } from "./custom_types";
import { SUBJECTS } from "./subjects";

export function get_outer() {
    console.log("get_outer!")
}

function remove_special_chars(str: string) {
    return str.replace(/[^a-zA-Z ]/g, "");
}

function to_lower(str: string) {
    return str.toLowerCase()
}

function format_string<T extends string>(str: T) {
    return to_lower(remove_special_chars(str))
}


const label_queries = {
    "www.dr.dk" : {
        labels : [{
            query : ".dre-teaser-meta-label.dre-teaser-meta-label--primary",
            container_query : "li"
        }] as const
    }
} as const



function query_elems(custom_document : CUSTOM_DOCUMENT.Document, query : string) : CUSTOM_DOCUMENT.NodeElemLabel[] {
    return custom_document.querySelectorAll(query)
}

export function get_labels_elems(
    site : keyof typeof label_queries, 
    custom_document : CUSTOM_DOCUMENT.Document,
    subjects : typeof SUBJECTS[number][]
    ) {

    const labels = query_elems(custom_document, label_queries[site].labels[0].query) 

    return Array.from(labels)
        .filter(x => {
            return subjects.map(format_string).includes(format_string(x.innerText))
        })
        .map(x => {
            return {
                label : format_string(x.innerText),
                elem : x,
                container : x.closest(label_queries[site].labels[0].container_query)
            }
        });
}
