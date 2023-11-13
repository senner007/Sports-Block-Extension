import { contentMediator } from "../mediator";
import { ContentController } from "./contentController";
import { ContentView } from "./contentView";

function toggleHTMLVisibility(toggle : "hidden" | "visible") {
    document.getElementsByTagName("html")[0].style.visibility=toggle;
}

(async () =>  {
    toggleHTMLVisibility("hidden")

    window.onload= async function () {

        await contentMediator.setCategories(["kampsport", "tennis"])
    
        const controller = new ContentController<Document, HTMLElement>(new ContentView(), contentMediator, window.location.host);

        controller.markElementsInit();

        toggleHTMLVisibility("visible")

        controller.observeElements(controller.markElements)

    }

})();




