import { removeChildNodes } from "../utils";

const hostContainers = {

}


export interface IArticleElements<TElement> {
    elem: TElement
    pathname : string;
    href: string | undefined,
}


export interface IContentView<TRoot, TElement> {
    root : TRoot;
    getElements(host: string, root: TElement | TRoot): IArticleElements<TElement>[]
    hideElement(elem: TElement): void
    tagForRemoval(elem: TElement, toggle: "ON" | "OFF"): void
    observeElements(callback: Function): void
    clearSelection(elem: TElement): void
    addLocateListeners(callback : Function) : void
    removeLocateListeners() : void
    locateListener(callback : Function)  : (e: Event) => void
    createModal(callback : () => void) : void
    openModal() : void
    closeModal() : void
    appendToModal(paths: string[]) : void
}

export class ContentView<TRoot extends Document, TElement extends HTMLElement | HTMLAnchorElement> implements IContentView<TRoot, TElement> {
    tagClass = "sports-block-extension-locate";
    hideClass = "sports-block-extension-hide"
    locateListenerInstance: any
    public root = document as TRoot;

    clearSelection(elem: TElement): void {
        elem.classList.remove(this.hideClass)
        elem.classList.remove(this.tagClass)
    }
    tagForRemoval(elem: TElement, toggle: "ON" | "OFF"): void {
        if (toggle === "ON") {
            elem.classList.add(this.tagClass)
        } else {
            elem.classList.remove(this.tagClass)
        }
    }
    hideElement(elem: TElement): void {
        elem.classList.add(this.hideClass)
    }
    locateListener(callback: Function) {

        return function Foo(e: Event) {
            e.preventDefault()
            const pathname = (e.target as HTMLElement).querySelector("a")!.pathname
            callback(pathname)
        }
    }

    createModal = (callback : () => void) => {
        var div = document.createElement("div");
        div.classList.add("extension-modal")
        div.id = "myModal"
        div.innerHTML = `<div class="extension-modal-content">
            <div class="extension-modal-container">
                <div><h3>Select elements to hide</h3></div>
                <div class="extension-modal-close">&times;</div>
            </div>
            <p>(click close when done)</p>
            <ul id="modal-content-paths"></ul>
        </div>`
        document.body.appendChild(div);
        
        document.querySelector(".extension-modal-close")?.addEventListener("click", () => {
          this.closeModal();
          callback();
        });
      }

      appendToModal = (paths : string[]) => {
        const nodalCOntentPaths = document.querySelector("#modal-content-paths")!;
        const currentLinks = Array.from(nodalCOntentPaths.querySelectorAll('li')).map(l => l.textContent) as string[]
        const totalLinks = Array.from(new Set([...currentLinks, ...paths]))
        this.clearModelContent();
    
        for (const l of totalLinks) {
          var li = document.createElement("li");
          li.innerHTML = l
          nodalCOntentPaths.appendChild(li)
        }
    
      }
    
      clearModelContent = () => {
        const nodalCOntentPaths = document.querySelector("#modal-content-paths")!
        removeChildNodes(nodalCOntentPaths as HTMLElement);
      }
    
      openModal = () => {
        const modal = document.querySelector("#myModal") as HTMLElement
        this.clearModelContent();
        modal!.style.display = "block";
      }
    
      closeModal = () => {
        try {
          const modal = document.querySelector("#myModal") as HTMLElement
          modal!.style.display = "none";
        } catch(err) {
          console.log("Modal not loaded yet")
        }
    
    }

    addLocateListeners(callback : Function) {
        this.removeLocateListeners()
        this.locateListenerInstance = this.locateListener(callback);
        const elems = document.querySelectorAll("." + this.tagClass)
        elems.forEach(e => {
            e.addEventListener("click", this.locateListenerInstance)
        })
 
    }
    removeLocateListeners = ()  => {
    
        const elems = document.querySelectorAll("." + this.tagClass)
        elems.forEach(e => {
            e.removeEventListener("click", this.locateListenerInstance)
        })
    }

    observeElements(callback: (elem : TElement) => Promise<void> ): void {

        const targetNode = document.documentElement

        // Options for the observer (which mutations to observe)
        const config: MutationObserverInit = { childList: true, subtree: true, characterData: false };

        // Callback function to execute when mutations are observed
        const mutationCallback = async (mutations: MutationRecord[], observer: MutationObserver) => {

            for (const mutationRecord of mutations) {
                await callback(mutationRecord.target as TElement)
            }

        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(mutationCallback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode!, config);


    }
    getElements(sportsSection: string, root: TRoot | TElement):  IArticleElements<TElement>[] {

        const elems = Array.from(root.querySelectorAll("a"))
            .filter((l) => l.href.includes(sportsSection))
            .map(elem => elemRecurse(elem))
        

        function elemRecurse(elem: HTMLElement | HTMLAnchorElement): HTMLElement | HTMLAnchorElement {
            const parentNodeLinkElems = elem.parentElement?.querySelectorAll("a")!
            const parrentNodeHrefSet = [...new Set(Array.from(parentNodeLinkElems).map(e => e.href))]
            if (parrentNodeHrefSet.length > 1) {
                return  elem 
            }
            return elemRecurse(elem.parentElement!)

        }

        return elems
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

