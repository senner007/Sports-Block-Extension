

import { IArticleElements, IContentView } from "../../src/Content/contentView"
import { IContentMediator } from "../../src/mediator"

type TElems = { name : string, isHidden : boolean}

export class ContentViewMock<TRoot extends object, TElement extends TElems> implements IContentView<TRoot, TElement> {
    addLocateListeners(): void {
        throw new Error("Method not implemented.")
    }
    removeLocateListeners(): void {
        throw new Error("Method not implemented.")
    }
    locateListener(callback : Function): (e: Event) => void  {
        throw new Error("Method not implemented.")
    }
    addListeners(): void {
        throw new Error("Method not implemented.")
    }
    public root = {} as TRoot

    public elems = [
        { name : "elem1", isHidden : false }
    ] as TElement[]

    getElements(host: string, root: TRoot | TElement): IArticleElements<TElement>[] {
        // Brug puppeteer her i stedet
        return [{
            elem : this.elems[0],
            href: "fake-href"
        }]
    }
    hideElement(elem: TElement): void {
        elem.isHidden = true
    }
    tagForRemoval(elem: TElement, toggle: "ON" | "OFF"): void {
        throw new Error("Method not implemented.")
    }
    observeElements(callback: Function): void {
        throw new Error("Method not implemented.")
    }
    clearSelection(elem: TElement): void {
        return
    }

}

export class ContentMediatorMock implements IContentMediator {
    receiveListener(listener: (request: any, sender: any, sendResponse: (message: any) => void) => void): Promise<void> {
        throw new Error("Method not implemented.")
    }
    setCategories(categories: string[]): Promise<void> {
        throw new Error("Method not implemented.")
    }
    getCategories(): Promise<string[]> {
       return new Promise(res => res(["fake-label-1", "fake-label-2"]))
    }
   

}
