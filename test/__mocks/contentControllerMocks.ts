

import { IArticleElements, IContentView } from "../../src/Content/contentView"
import { IContentMediator } from "../../src/mediator"

type TElems = { name : string, isHidden : boolean}

export class ContentViewMock<TRoot extends object, TElement extends TElems> implements IContentView<TRoot, TElement> {
    createModal(callback: () => void): void {
        throw new Error("Method not implemented.")
    }
    openModal(): void {
        throw new Error("Method not implemented.")
    }
    closeModal(): void {
        throw new Error("Method not implemented.")
    }
    appendToModal(paths: string[]): void {
        throw new Error("Method not implemented.")
    }
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
            href: "fake-href",
            pathname : "fake-path"
        }]
    }
    hideElement(elem: TElement): void {
        elem.isHidden = true
    }
    tagForRemoval(elem: TElement, toggle: "ON" | "OFF"): void {
        return
    }
    observeElements(callback: Function): void {
        return
    }
    clearSelection(elem: TElement): void {
        return
    }

}

export class ContentMediatorMock implements IContentMediator {
    requestUrlHTML(message: object): Promise<string> {
        throw new Error("Method not implemented.")
    }

    receiveListener(listener: (request: any, sender: any, sendResponse: (message: any) => void) => void): Promise<void> {
        return new Promise(res => res())
    }
    setCategories(categories: string[]): Promise<void> {
        throw new Error("Method not implemented.")
    }
    getCategories(): Promise<string[]> {
       return new Promise(res => res(["fake-label-1", "fake-label-2"]))
    }
   

}
