import { contentMediator } from "../mediator";
import { ContentController } from "./contentController";
import { ContentView } from "./contentView";


function toggleHTMLVisibility(toggle: "hidden" | "visible") {
    document.getElementsByTagName("html")[0].style.visibility = toggle;
}

;(async () => {

    // toggleHTMLVisibility("hidden")

    // window.onload = async function () {

        await contentMediator.setCategories(["kampsport", "tennis", "fodbold"]) // is persistent

        const controller = new ContentController<Document, HTMLElement>(new ContentView(), contentMediator, window.location.host);

        await controller.init();

        toggleHTMLVisibility("visible")
         
        const response = await chrome.runtime.sendMessage({sentence: "KORT SPORT . Dansk VM-bagspiller skifter Frankrig ud med Ungarn . Den danske håndboldspiller Kristina Jørgensen skifter Frankrig ud med Ungarn fra den kommende sæson"});
        // do something with response here, not outside the function
        console.log(response);
    // }

})();




