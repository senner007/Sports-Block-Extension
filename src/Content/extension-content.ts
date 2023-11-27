import { contentMediator } from "../mediator";
import { removeTRailingFullStopAndSpace } from "../utils";
import { ContentController } from "./contentController";
import { ContentView } from "./contentView";

function toggleHTMLVisibility(toggle: "hidden" | "visible") {
    document.getElementsByTagName("html")[0].style.visibility = toggle;
}

function hostInfo(): TypeHost {
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
            },
            parser(parsed: HTMLDivElement): [string, string, string] {

                const label = parsed.querySelector(".dre-article-title-section-label__title--link")?.textContent!
                    || parsed.querySelector(".dre-teaser-meta-label.dre-teaser-meta-label--primary")?.textContent!
            
                const header =
                    parsed.querySelector(".dre-title-text")?.textContent!
                const subHeader =
                    parsed.querySelector(".dre-article-title__summary")?.textContent!
                    ||
                    parsed.querySelector(".hydra-latest-news-page-short-news-article__paragraph.dre-variables")?.textContent!
            
                return [
                    label, header, subHeader
                ]
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
            },
            parser(parsed: HTMLElement): [string, string, string] {

                const label = parsed.querySelector(".tc_page__label")?.childNodes[0].textContent!;
                const header: string = parsed.querySelector(".tc_heading.tc_heading--2")?.childNodes[0].textContent!;
                const subHeader =
                    parsed.querySelector(".tc_page__body__standfirst")?.childNodes[0].childNodes[0].textContent! ||
                    parsed.querySelector(".tc_richcontent")?.firstChild!.textContent!;
            
                return [
                    label, header, subHeader
                ]
            }
        }
    }
    throw new Error("host undefined")
}

export type TypeHost = { location: string, sportsSection: string, sportsPath: string, getLabels : (href : string) => string[], parser : Function }

; (async () => {

    window.onload = async function () {
        console.log("WINDIW LOADED EVENT")
        const controller = new ContentController<Document, HTMLElement>(new ContentView(), contentMediator, hostInfo()!);
        await controller.init();
    }

})();