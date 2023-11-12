import { extensionStorage } from "./storage";

enum MESSAGE_TOPICS {
    ELEMENT_SELECT_MODE_ON,
    ELEMENT_SELECT_MODE_OFF
}

abstract class Mediator {

    async receiveListener(
        listener : (request: any, sender: any, sendResponse: (message : any) => void) => void 
        ) {
            chrome.runtime.onMessage.addListener(listener)
    }
    async setCategories(categories : string[]) {
        return extensionStorage.storage_set("categories", categories)
    }
    async getCategories() {
        return extensionStorage.storage_get("categories")
    }

}

class UIMediator extends Mediator implements IUIMediator {
    private async sendMessage(topic : MESSAGE_TOPICS, mesage : string) {
        const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
        const response = await chrome.tabs.sendMessage(tab.id!, {topic, mesage});
        return response
    }
    async getRemovedElements()  {
        return extensionStorage.storage_get("removedElements")
    }

    async getFilterByResultsState() {
        return extensionStorage.storage_get("filterByResultState")
    }

    async setFilterByResultsState(state : true | false) {
        extensionStorage.storage_set("filterByResultState", state)
    }

    async requestElementSelectMode(mode : "ON" | "OFF") {
            await this.sendMessage(
                mode === "ON" 
                ? MESSAGE_TOPICS.ELEMENT_SELECT_MODE_ON 
                : MESSAGE_TOPICS.ELEMENT_SELECT_MODE_OFF
                , "")
    }
}

class ContentMediator extends Mediator implements IContentMediator {
    async sendMessage(message: string) {
        const response = await chrome.runtime.sendMessage({message});
        console.log("sent content message")
        return response
    }
}



export interface IUIMediator extends Mediator {
    getRemovedElements() : Promise<string[]>
    getFilterByResultsState() : Promise<boolean>
    setFilterByResultsState(state : true | false) : Promise<void>
    requestElementSelectMode(mode : "ON" | "OFF") : Promise<void>
}

export interface IContentMediator extends Mediator {

}


export const contentMediator = new ContentMediator()
export const uiMediator = new UIMediator()
