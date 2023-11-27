import { removeChildNodes, removeTRailingFullStopAndSpace } from "../utils";
import { TypeHost } from "./extension-content";


// export function parseDR(parsed: HTMLDivElement): [string, string, string] {

//     const label = parsed.querySelector(".dre-article-title-section-label__title--link")?.textContent!
//         || parsed.querySelector(".dre-teaser-meta-label.dre-teaser-meta-label--primary")?.textContent!

//     const header =
//         parsed.querySelector(".dre-title-text")?.textContent!
//     const subHeader =
//         parsed.querySelector(".dre-article-title__summary")?.textContent!
//         ||
//         parsed.querySelector(".hydra-latest-news-page-short-news-article__paragraph.dre-variables")?.textContent!

//     return [
//         label, header, subHeader
//     ]
// }

// export function parseTV2(parsed: HTMLElement): [string, string, string] {

//     const label = parsed.querySelector(".tc_page__label")?.childNodes[0].textContent!;
//     const header: string = parsed.querySelector(".tc_heading.tc_heading--2")?.childNodes[0].textContent!;
//     const subHeader =
//         parsed.querySelector(".tc_page__body__standfirst")?.childNodes[0].childNodes[0].textContent! ||
//         parsed.querySelector(".tc_richcontent")?.firstChild!.textContent!;

//     return [
//         label, header, subHeader
//     ]
// }

export interface IArticleElements<TElement> {
    elem: TElement
    pathname : string;
    href: string | undefined,
}


export interface IContentView<TRoot, TElement> {
    root : TRoot;
    getElements(host: string, root: TElement | TRoot): IArticleElements<TElement>[]
    hideElement(elem: TElement): void
    tagForRemoval(elem: TElement, toggle: "ON" | "OFF", callback : Function): void
    observeElements(callback: Function): void
    clearSelection(elem: TElement): void
    addLocateForRemovalListeners(elem : TElement, callback : Function) : void
    locateListener(callback : Function)  : (e: Event) => void
    createModal(callback : () => void) : void
    openModal() : void
    closeModal() : void
    appendToModal(paths: string[]) : void
    parseUrl(hostInfo: TypeHost, html : string): string;
    
}

export class ContentView<TRoot extends Document, TElement extends HTMLElement | HTMLAnchorElement> implements IContentView<TRoot, TElement> {
    tagClass = "sports-block-extension-locate";
    hideClass = "sports-block-extension-hide"
    locateListenerInstance: any;
    modalClassName = "extension-modal"
    modalContentPathsClassName = "modal-content-paths"
    public root = document as TRoot;

    clearSelection(elem: TElement): void {
        elem.classList.remove(this.hideClass)
        elem.classList.remove(this.tagClass)
        elem.removeEventListener("click", this.locateListenerInstance)
    }

    tagForRemoval(elem: TElement, toggle: "ON" | "OFF", callback : Function): void {
        if (toggle === "ON") {
            elem.classList.add(this.tagClass)
            this.addLocateForRemovalListeners(elem, callback)
        } else {
            elem.classList.remove(this.tagClass)
        }
    }

    hideElement(elem: TElement): void {
        elem.classList.add(this.hideClass)
    }

    locateListener(callback: Function) {

        return function (e: Event) {
            e.preventDefault()
            const href = (e.target as HTMLElement).querySelector("a")!.href
            callback(href)
        }
    }

    createModal = (callback : () => void) => {
        var div = document.createElement("div");
        div.classList.add(this.modalClassName)
        div.innerHTML = `<div class="extension-modal-content">
            <div class="extension-modal-container">
                <div><h3>Select elements to hide</h3></div>
                <div class="extension-modal-close">&times;</div>
            </div>
            <p>(click close when done)</p>
            <ul class="${this.modalContentPathsClassName}"></ul>
        </div>`
        document.body.appendChild(div);
        
        document.querySelector(".extension-modal-close")?.addEventListener("click", () => {
          this.closeModal();
          callback();
        });
      }

      appendToModal = (paths : string[]) => {
        const nodalCOntentPaths = document.querySelector("." + this.modalContentPathsClassName)!;
        const currentLinks = Array.from(nodalCOntentPaths.querySelectorAll('li')).map(l => l.textContent) as string[]
        const totalLinks = Array.from(new Set([...currentLinks, ...paths]))
        this.clearModelContent();
    
        for (const link of totalLinks) {
          var li = document.createElement("li");
          li.innerHTML = link
          nodalCOntentPaths.appendChild(li)
        }
    
      }
    
      clearModelContent = () => {
        const nodalCOntentPaths = document.querySelector("." + this.modalContentPathsClassName)!
        removeChildNodes(nodalCOntentPaths as HTMLElement);
      }
    
      openModal = () => {
        const modal = document.querySelector("." + this.modalClassName) as HTMLElement
        this.clearModelContent();
        modal!.style.display = "block";
      }
    
      closeModal = () => {
        try {
          const modal = document.querySelector("." + this.modalClassName) as HTMLElement
          modal!.style.display = "none";
        } catch(err) {
          console.log("Modal not loaded yet")
        }
    
    }

    addLocateForRemovalListeners(elem : TElement, callback : Function) {
        this.locateListenerInstance =  this.locateListenerInstance ?  this.locateListenerInstance : this.locateListener(callback);
        elem.addEventListener("click", this.locateListenerInstance)
    }


    parseUrl(hostInfo: TypeHost, html : string) {

        var div = document.createElement("div");
        div.innerHTML = html;

        let sentences = hostInfo.parser(div);

        return removeTRailingFullStopAndSpace(sentences!.join(" . "))
    }


    observeElements(callback: (elem : TElement) => Promise<void> ): void {

        const targetNode = document.documentElement
        const config: MutationObserverInit = { childList: true, subtree: true, characterData: false };
        const mutationCallback = async (mutations: MutationRecord[], observer: MutationObserver) => {

            for (const mutationRecord of mutations) {
                await callback(mutationRecord.target as TElement)
            }

        };
        const observer = new MutationObserver(mutationCallback);
        observer.observe(targetNode!, config);

    }
    getElements(sportsSection: string, root: TRoot | TElement):  IArticleElements<TElement>[] {

        const elems = Array.from(root.querySelectorAll("a"))
            .filter((l) => l.href.includes(sportsSection))
            .filter((l) => l.href.includes("-"))
            .map(elem => elemRecurse(elem))
        

        function elemRecurse(elem: HTMLElement | HTMLAnchorElement): HTMLElement | HTMLAnchorElement {
            const parentNodeLinkElems = elem.parentElement?.querySelectorAll("a")!
            const parrentNodeHrefSet = [...new Set(Array.from(parentNodeLinkElems).map(e => e.href))]
            if (parrentNodeHrefSet.length > 1) {
                return  elem 
            }
            return elemRecurse(elem.parentElement!)

        }

        const elems_set: TElement[] = []
        elems.forEach(elem => {
            if (!elems_set.some(x => elem.isEqualNode(x))) {
                elems_set.push(elem as TElement)
            }
        });

        return elems_set
            .map(elem => {
                let e;
                if ("href" in elem) {
                    e = elem.querySelector("a") || elem
                } else {
                    e = elem.querySelector("a")!
                }
                
                return {
                    elem: elem,
                    pathname: e.pathname,
                    href :  e.href

                }
            }) as IArticleElements<TElement>[]

    }

}

