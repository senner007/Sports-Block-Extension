import { get_labels_elems } from "./container-methods";
import { CUSTOM_DOCUMENT } from "./custom_types";
import { contentMediator } from "./mediator";

// var $ = require('jquery');

// console.log($)


// const browser_document = {
//     querySelectorAll: function (query: string): CUSTOM_DOCUMENT.NodeElemLabel[] {
//         return document.querySelectorAll(query) as unknown as CUSTOM_DOCUMENT.NodeElemLabel[];
//     },
// };

// (async () => {
//     await contentMediator.setCategories(["KAMPSPORT", "TENNIS"])

//     const list_of_elems = await contentMediator.getCategories();

//     const label_elems = get_labels_elems("www.dr.dk", browser_document, list_of_elems);

//     function remove_elems(elems: typeof label_elems) {
//         // TODO : verify each elem only has one label before calling remove. Call recursively untill all elements removed
//         for (const e of elems) {
//             e.container.remove();
//             console.log("removed!");
//         }
//     }
//     remove_elems(label_elems);
// })();
// function receiver(request: any, sender: any, sendResponse: (message: any) => void) {
//     console.log("request received in content:");
//     console.log(request);
//     try {
//         contentMediator.sendMessage("from content");
//     } catch (error) {
//         console.log("content send error :" + error);
//     }
//     // sendResponse({farewell: "goodbye"});
// }

// contentMediator.receiveListener(receiver);

// const sportsLinks = Array.from(document.querySelectorAll("a"))
//     .filter((l) => l.href.includes("www.dr.dk/sporten/"))
//     .map((l) => {
//         const closest = l.closest("li");
//         if (closest) {
//             return closest;
//         }
//         console.log(l);
//         return l;
//     });

// const unique = Array.from(new Set(sportsLinks)).map((elem) => {
//     // console.log((elem as HTMLElement).style)
//     (elem as HTMLElement).style.outline = "2px dotted red";
//     (elem as HTMLElement).style.outlineOffset = "5px";
//     // (elem as HTMLElement).style.opacity = "0.7";

    
//     var div = document.createElement("div");
//     div.innerHTML = "Foo"
//     div.style.position = "absolute";



//     elem.innerHTML = `<div><span style='position: absolute; color : white; z-index: 1000; width: ${elem.clientWidth}px; background: red; padding: 0 5px 0 5px; text-align: center'>Click to remove</span>` + elem.innerHTML + "</div>"

//     // const newElem = "<div style='width:" + elem.clientWidth + "px;height:" + elem.clientHeight + "px;overflow:hidden;display:block;padding:0;border:0;margin:0'></div>";

//     // $(elem).before(newElem

    
//     return elem;
// });

// console.log(unique);

// function elemSelector(e: Event) {

//     e.preventDefault();
//     console.log(e);
// }

// unique.map((elm) => {
//     elm.addEventListener("click", elemSelector);
// });

// Array.from(document.querySelectorAll('.dre-grid-layout-list__item'))
// .map(elm =>  {
//     elm.removeEventListener("click" ,elemSelector)
// })

// chrome.runtime.onMessage.addListener(

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
