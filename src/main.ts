
import { get_outer, get_labels_elems } from "./container-methods";
import { CUSTOM_DOCUMENT } from "./custom_types";
import { storage_get, storage_set } from "./storage";

const browser_document = {
    querySelectorAll: function (query : string) : CUSTOM_DOCUMENT.NodeElemLabel[] {
        return document.querySelectorAll(query) as unknown as CUSTOM_DOCUMENT.NodeElemLabel[]
    }
}

;(async () => {
    await storage_set("labels", ["KAMPSPORT", "TENNIS"])

    const list_of_elems = await storage_get("labels")

    console.log(list_of_elems)

    const label_elems = get_labels_elems("www.dr.dk", browser_document, list_of_elems)
    

    function remove_elems(elems: typeof label_elems) {
        // TODO : verify each elem only has one label before calling remove. Call recursively untill all elements removed
        for (const e of elems) {
            e.container.remove()
            console.log("removed!")
        }
    }
    remove_elems(label_elems)

})()


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request)

    //   console.log(sender.tab ?
    //               "from a content script:" + sender.tab.url :
    //               "from the extension");
    //   if (request.greeting === "hello")
    //     sendResponse({farewell: "goodbye"});
    }
  );

// console.log(label_elems);




    // (async () => {

    //     remove_elems(label_elems)
    //     const response = await chrome.runtime.sendMessage({greeting: "hello"});
    //     // do something with response here, not outside the function
    //     console.log("message sent")
    //     console.log(response);
    // })();
    







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

