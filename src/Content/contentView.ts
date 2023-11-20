
const hostContainers = {

}


export interface IArticleElements<TElement> {
    elem: TElement
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
    getElements(host: string, root: TRoot | TElement):  IArticleElements<TElement>[] {

        const elems = Array.from(root.querySelectorAll("a"))
            .filter((l) => l.href.includes("www.dr.dk/sporten/"))
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
                    href: e.pathname
                }
            }) as IArticleElements<TElement>[]

    }

}

