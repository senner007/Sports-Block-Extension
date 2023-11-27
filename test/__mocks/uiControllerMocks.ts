
import { IUIView } from "../../src/UI/uiView"
import { IUIMediator } from "../../src/mediator"

export class uiViewMock implements IUIView {
    displayRemovedElements(removedElements: { url: string; labels: string[] }[]): void {
        throw new Error("Method not implemented.")
    }
    clickCategory(callback: (category: string) => Promise<void>): void {
        return
    }

    toggleElementSelectButton(callback: (toggle: "ON" | "OFF") => Promise<void>): void {
        callback("ON")
    }
    toggleFilterByResultsButton(callback: (toggle: "ON" | "OFF") => Promise<void>): void {
        callback("ON")
    }
    displayFilterByResultsButton(toggle: "ON" | "OFF"): void {
      return
    }

    private categories: string[] = []
    private removedElements: string[] = []  
    displayCategories(categories: string[]): void {
        this.categories = [...this.categories, ...categories]
    }

}


export class uiMediatorMock implements IUIMediator {
    getElemsRemoved(): Promise<{ url: string; labels: string[] }[]> {
        throw new Error("Method not implemented.")
    }

    setFilterByResultsState(mode: "ON" | "OFF"): Promise<void> {
        return new Promise(res => res())
    }
    sendMessageStorageUpdate(): Promise<void> {
        return new Promise(res => res())
    }

    getFilterByResultsState(): Promise<boolean> {
        return new Promise(res => res(true))
    }
    requestElementSelectMode(): Promise<void> {
        return new Promise(res => res())
    }
    getRemovedElements(): Promise<string[]> {
        return new Promise((resolve, _) => resolve(["https://www.foo.bar/removed/1", "https://www.foo.bar/removed/2"]))
    }
    setCategories(categories: string[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getCategories(): Promise<string[]> {
        return new Promise((resolve, _) => resolve(["Category_1", "Category_2"]))
    }
    receiveListener(listener: (request: any, sender: any, sendResponse: (message: any) => void) => void): Promise<void> {
        throw new Error("Method not implemented.");
    }

}
