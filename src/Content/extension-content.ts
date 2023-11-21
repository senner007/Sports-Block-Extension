import { contentMediator } from "../mediator";
import { removeTRailingFullStopAndSpace } from "../utils";
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
    if (host === "nyheder.tv2.dk" || host === "tv2.dk") {
        console.log("tv2")
        return {
            location : host,
            sportsSection : "sport.tv2.dk",
            sportsPath : ""
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

    

   
            const controller = new ContentController<Document, HTMLElement>(new ContentView(), contentMediator, getHost()!);

            await controller.init();
    
            toggleHTMLVisibility("visible")
            
        window.onload = async function () {
            controller.createModal();
        }
        
        // const url = await chrome.runtime.sendMessage({url: "https://www.dr.dk/sporten/fodbold/landsholdet/der-er-noget-stolthed-og-aere-der-lider-et-knaek"});


        



})();