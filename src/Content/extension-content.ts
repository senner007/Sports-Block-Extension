import { contentMediator } from "../mediator";
import { removeTRailingFullStopAndSpace } from "../utils";
import { ContentController } from "./contentController";
import { ContentView } from "./contentView";

function toggleHTMLVisibility(toggle: "hidden" | "visible") {
    document.getElementsByTagName("html")[0].style.visibility = toggle;
}

function getHost(): { location: string, sportsSection: string, sportsPath: string } | undefined {
    const host = window.location.host;
    if (host === "www.dr.dk") {
        return {
            location: host,
            sportsSection: host + "/sporten",
            sportsPath: "/sporten"
        }
    }
    if (host === "nyheder.tv2.dk" || host === "tv2.dk") {
        console.log("tv2")
        return {
            location: host,
            sportsSection: "sport.tv2.dk",
            sportsPath: ""
        }
    }
}


; (async () => {

    window.onload = async function () {
        const controller = new ContentController<Document, HTMLElement>(new ContentView(), contentMediator, getHost()!);
        await controller.init();
        controller.createModal();
    }

})();