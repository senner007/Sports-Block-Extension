
const hostContainers = {

}


export interface IArticleElements<TElement> {
    elem: TElement
    label: string | null | undefined
    href: string | undefined
}


export interface IContentView<TRoot, TElement> {
    root : TRoot;
    getElements(host: string, root: TElement | TRoot): IArticleElements<TElement>[]
    hideElement(elem: TElement): void
    tagForRemoval(elem: TElement, toggle: "ON" | "OFF"): void
    observeElements(callback: Function): void
    clearSelection(elem: TElement): void
}

export class ContentView<TRoot extends Document, TElement extends HTMLElement> implements IContentView<TRoot, TElement> {
    tagClass = "sports-block-extension-locate";
    hideClass = "sports-block-extension-hide"
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
    getElements(host: string, root: TRoot | TElement) {

        const elems = Array.from(root.querySelectorAll("a"))
            .filter((l) => l.href.includes("www.dr.dk/sporten/"))
            .map(elem => elemRecurse(elem))


        function elemRecurse(elem: HTMLElement) {
            const parentNodeLinkElems = elem.parentElement?.querySelectorAll("a")!
            const parrentNodeHrefSet = [...new Set(Array.from(parentNodeLinkElems).map(e => e.href))]
            if (parrentNodeHrefSet.length > 1) {
                return elem
            }
            return elemRecurse(elem.parentElement!)

        }


        const elems_set: HTMLElement[] = []
        elems.forEach(elem => {
            if (!elems_set.some(x => elem.isEqualNode(x))) {
                elems_set.push(elem)
            }
        });

        return elems_set
            .map(elem => {
                return {
                    elem: elem as TElement,
                    label: elem.querySelector(".dre-teaser-meta-label")?.textContent,  // get label through href tag
                    href: elem.querySelector("a")?.href
                }
            })


    }

}

