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
    
        const controller = new ContentController(new ContentView(), contentMediator);
    
        const categories = await controller.getCategories();
        console.log(categories)
    
        const elems = await controller.findElementsOnPage();
        console.log(elems)
    
        controller.hideByCategory(categories, elems)

        controller.locateForSelection(categories, elems)

        toggleHTMLVisibility("visible")
    }

})();




