
const hostContainers = {

}


export interface IArticleElements {
    elem : HTMLElement
    label : string | null | undefined
    href : string | undefined
}


export interface IContentView {
    getElements(host : string) : IArticleElements[]
    hideElement(elem : HTMLElement) : void
    locateElement(elem : HTMLElement) : void
}

export class ContentView implements IContentView {
    locateElement(elem: HTMLElement): void {
        elem.classList.add("sports-block-extension-locate")
    }
    hideElement(elem: HTMLElement): void {
        elem.classList.add("sports-block-extension-hide")

        // var div = document.createElement("div");
        // div.style.position = "absolute";
        // div.style.width = `${elem.clientWidth}px`
        // div.style.color = "red"
        // div.textContent = "Blocked by Extension"
       
        // elem.parentElement?.appendChild(div)
    }
    getElements(host: string) : IArticleElements[] {

  
            const elems = Array.from(document.querySelectorAll("a"))
            .filter((l) => l.href.includes("www.dr.dk/sporten/"))
            .map((l) => {
        
                const closest = l.closest(".dre-teaser") || l.closest(".hydra-latest-news-teaser__content") 
                return closest as HTMLElement
                // if (closest) {
                //     return closest;
                // }
                // return l;
            })
            .filter(elem => elem !== null)

            const elems_set : HTMLElement[]= []
            elems.forEach(elem => {
                if (!elems_set.some(x => elem.isEqualNode(x))) {
                    elems_set.push(elem)
                }

            });

            return elems_set
                .map(elem  => {
                    return {
                        elem,
                        label : elem.querySelector(".dre-teaser-meta-label")?.textContent,
                        href : elem.querySelector("a")?.href
                    }
                })

    
    }
       
}

