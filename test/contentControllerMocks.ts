

import { IArticleElements, IContentView } from "../src/Content/contentView"
import { IContentMediator } from "../src/mediator"

class ContentViewMock implements IContentView {
    locateElement(elem: HTMLElement): void {
        throw new Error("Method not implemented.")
    }
    hideElement(elem: HTMLElement): void {
        throw new Error("Method not implemented.")
    }
    getElements(host: string): IArticleElements[] {
        throw new Error("Method not implemented.")
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
        throw new Error("Method not implemented.")
    }
   

}

export const contentMediatorMockInstance = new ContentMediatorMock()
export const contentViewMockInstance = new ContentViewMock()