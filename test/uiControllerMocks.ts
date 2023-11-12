
import { IUIView } from "../src/UI/uiView"
import { IUIMediator } from "../src/mediator"

class uiViewMock implements IUIView {

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
    displayRemovedElements(removedElements: string[]): void {
        this.removedElements = [...this.removedElements, ...removedElements]
    }
}

class uiMediatorMock implements IUIMediator {
    setFilterByResultsState(state: boolean): Promise<void> {
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

export const uiMediatorMockInstance = new uiMediatorMock()
export const uiViewMockInstance = new uiViewMock()