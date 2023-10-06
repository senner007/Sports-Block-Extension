
import { get_outer, get_labels_elems } from "./container-methods";
import { CUSTOM_DOCUMENT } from "./custom_types";


const browser_document = {
    querySelectorAll: function (query : string) : CUSTOM_DOCUMENT.NodeElemLabel[] {
        return document.querySelectorAll(query) as unknown as CUSTOM_DOCUMENT.NodeElemLabel[]
    }
}

const label_elems = get_labels_elems("www.dr.dk", browser_document, ["Sport"])

console.log(label_elems);

function remove_elems() {
    // TODO : verify each elem only has one label before calling remove. Call recursively untall all elements removed
}


// const teaser_names = get_teaser_names(label_elems, subjects)


// function remove_duplicate_teasers() {
//     const set_subject_elems = []

//     teaser_names(label_elems, subjects)
//         .forEach(item => {
//             if (!set_subject_elems.some(x => item.container.isEqualNode(x.container))) {
//                 set_subject_elems.push(item)   
//             }
//         })

//     return set_subject_elems;

// }

// function delete_items(elems) {


// }



    // .filter((item, index, arr) => arr.filter((x,ind) => ind != index).some(x => item.container.isEqualNode(x.container)));



// console.log(
//     set_subject_elems
// )

// set_subject_elems[1].container.remove()
// set_subject_elems[0].container.remove()

