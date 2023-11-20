import { contentMediator } from "../mediator";
import { ContentController } from "./contentController";
import { ContentView } from "./contentView";

function toggleHTMLVisibility(toggle: "hidden" | "visible") {
    document.getElementsByTagName("html")[0].style.visibility = toggle;
}

function getHost() : { location : string, sportsSection : string, sportsPath : string } | undefined {
    const host = window.location.host;
    if (host === "www.dr.dk") {
        return {
            location : host,
            sportsSection : host + "/sporten",
            sportsPath : "/sporten"
        }
    }
}

// const showModal = () => {
//     const modal = document.createElement("dialog");
//     modal.setAttribute(
//     "style",`
//     height:450px;
//     border: none;
//     top:0px;
//     border-radius:20px;
//     background-color:white;
//     position: fixed; box-shadow: 0px 12px 48px rgba(29, 5, 64, 0.32);
//     `
//     );
// }

// showModal();

// <!-- The Modal -->
// <div id="myModal" class="modal">

//   <!-- Modal content -->
//   <div class="modal-content">
//     <span class="close">&times;</span>
//     <p>Some text in the Modal..</p>
//   </div>

// </div>





;(async () => {

    // toggleHTMLVisibility("hidden")

    // window.onload = async function () {

        
    


        // await contentMediator.setCategories(["kampsport", "tennis", "fodbold"]) // is persistent

        const controller = new ContentController<Document, HTMLElement>(new ContentView(), contentMediator, getHost()!);

        await controller.init();

        toggleHTMLVisibility("visible")

        window.onload = async function () {
            controller.createModal();
        }
         
        const response = await chrome.runtime.sendMessage({sentence: "KORT SPORT . Dansk VM-bagspiller skifter Frankrig ud med Ungarn . Den danske håndboldspiller Kristina Jørgensen skifter Frankrig ud med Ungarn fra den kommende sæson"});
        // do something with response here, not outside the function
        console.log(response);
    // }

})();