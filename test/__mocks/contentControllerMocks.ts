

import { IArticleElements, IContentView } from "../../src/Content/contentView"
import { TypeHost } from "../../src/Content/extension-content"
import { IContentMediator } from "../../src/mediator"
import { expect, test, describe, vi } from "vitest";

const fakeStorage = {
    categories : [] as string[]
}


export class ContentViewMock<TRoot extends { elems: TElement[] }, TElement extends { href: string, pathname: string, isHidden: boolean }> implements IContentView<TRoot, TElement> {

    public root = {
        elems: [
            { href: "https://www.fake.com/fake-sport/fake-category1/fake1", pathname: "/fake-sport/fake-category1/fake1", isHidden: false },
            { href: "https://www.fake.com/fake-sport/fake-category2/fake2", pathname: "/fake-sport/fake-category2/fake2", isHidden: false },
            { href: "https://www.fake.com/fake-sport/fake-category3/fake3", pathname: "/fake-sport/fake-category3/fake3", isHidden: false }
        ] as TElement[]
    } as TRoot

    parseUrl(hostInfo: TypeHost, html: string): string {
        return ""
    }

    createModal(callback: () => void): void {
        return
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
    addLocateForRemovalListeners(): void {
        throw new Error("Method not implemented.")
    }
    removeLocateForRemovalListeners(): void {
        throw new Error("Method not implemented.")
    }
    locateListener(callback: Function): (e: Event) => void {
        throw new Error("Method not implemented.")
    }
    addListeners(): void {
        throw new Error("Method not implemented.")
    }

    getElements(host: string, root: TRoot | TElement): IArticleElements<TElement>[] {
        // TODO : Brug puppeteer her i stedet
        return this.root.elems.map(e => {
            return {
                elem: e,
                href: e.href,
                pathname: e.pathname
            }
        })
    }
    hideElement(elem: TElement): void {
        this.root.elems.forEach(elemInRoot => {
            if (elemInRoot.href === elem.href) {
                elemInRoot.isHidden = true;
            }
        })
        elem.isHidden = true
    }
    tagForRemoval(elem: TElement, toggle: "ON" | "OFF"): void {
        return
    }
    observeElements(callback:  (elem : TElement) => Promise<void>): void {
        vi.advanceTimersByTimeAsync(1000).then(res => {
            const elem = { href: "https://www.fake.com/fake-sport/fake-category1/fake4", pathname: "/fake-sport/fake-category1/fake4", isHidden: false } as TElement
            this.root.elems.push(elem)
            callback(elem)
        })

    }
    clearSelection(elem: TElement): void {
        return
    }
}

export class ContentMediatorMock implements IContentMediator {
    DomChangeUpdate(): void {
        return;
    }

    setElemsRemoved(removedElems: { url: string; labels: string[] }[]): void {
        throw new Error("Method not implemented.")
    }

    getFilterByResultsState(): Promise<boolean> {
        return new Promise(res => res(false))
    }
    requestModelEvaluate(message: { sentence: string }): Promise<number> {
        return new Promise(res => res(0))
    }
    requestUrlHTML(message: object): Promise<string> {
        return new Promise(res => res(""))
    }
    receiveListener(listener: (request: any, sender: any, sendResponse: (message: any) => void) => void): Promise<void> {
        return new Promise(res => res())
    }
    setCategories(categories: string[]): Promise<void> {
        fakeStorage.categories = categories;
        return new Promise(res => res())
    }
    getCategories(): Promise<string[]> {
        return new Promise(res => res(fakeStorage.categories))
    }


}
