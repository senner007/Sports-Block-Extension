

import { IArticleElements, IContentView } from "../src/Content/contentView"
import { IContentMediator } from "../src/mediator"

type TElems = { name : string, isHidden : boolean}

class ContentViewMock<TRoot extends object, TElement extends TElems> implements IContentView<TRoot, TElement> {
    public root = {} as TRoot

    public elems = [
        { name : "elem1", isHidden : false }
    ] as TElement[]

    getElements(host: string, root: TRoot | TElement): IArticleElements<TElement>[] {
        return [{
            elem : this.elems[0],
            label: "fake-label-1",
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

class ContentMediatorMock implements IContentMediator {
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

export const contentMediatorMockInstance = new ContentMediatorMock()
export const contentViewMockInstance = new ContentViewMock()