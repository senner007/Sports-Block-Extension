import { contentMediator } from "../mediator";
import { removeTRailingFullStopAndSpace } from "../utils";
import { ContentController } from "./contentController";
import { ContentView } from "./contentView";

function toggleHTMLVisibility(toggle: "hidden" | "visible") {
    document.getElementsByTagName("html")[0].style.visibility = toggle;
}

function getHost(): TypeHost {
    const host = window.location.host;
    if (host === "www.dr.dk") {
        return {
            location: host,
            sportsSection: host + "/sporten",
            sportsPath: "/sporten",
            getLabels(href: string) {
                // CURRENTLY NOT DRY!
                const paths = href.replace("https://" + this.sportsSection, "")
                const labels = paths.split("\/")
                .filter(name => name.length > 0)
                .filter((_: string, index: number, arr: string[]) => index < arr.length - 1) 

                return labels.length === 0 ? ["sport"] : labels

            }
        } as const
    }
    if (host === "nyheder.tv2.dk" || host === "tv2.dk") {
        return {
            location: host,
            sportsSection: "sport.tv2.dk",
            sportsPath: "",
            getLabels(href: string) {
                   // CURRENTLY NOT DRY!
                const paths = href.replace("https://" + this.sportsSection, "")
                const labels = paths.split("\/")
                .filter(name => name.length > 0)
                .filter((_: string, index: number, arr: string[]) => index < arr.length - 1) 
                return labels.length === 0 ? ["Sport"] : labels
            }
        }
    }
    throw new Error("host undefined")
}

export type TypeHost = { location: string, sportsSection: string, sportsPath: string, getLabels : (href : string) => string[] }

; (async () => {

    window.onload = async function () {
        console.log("WINDIW LOADED EVENT")
        const controller = new ContentController<Document, HTMLElement>(new ContentView(), contentMediator, getHost()!);
        await controller.init();
        controller.createModal();
    }

})();