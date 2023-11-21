import { extensionStorage } from "./storage";

export enum MESSAGE_TOPICS {
    ELEMENT_SELECT_MODE_ON,
    ELEMENT_SELECT_MODE_OFF,
    STORAGE_UPDATE
}

export type messageForm = { topic: MESSAGE_TOPICS, message: string }

abstract class Mediator {

    async receiveListener(
        listener: (request: any, sender: any, sendResponse: (message: any) => void) => void
    ) {
        chrome.runtime.onMessage.addListener(listener)
    }
    async setCategories(categories: string[]) {
        return extensionStorage.storage_set("categories", categories)

    }
    async getCategories() {
        return extensionStorage.storage_get("categories")
    }

}

class UIMediator extends Mediator implements IUIMediator {

    private async sendMessage(topic: MESSAGE_TOPICS, mesage: string) {
        const tab = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        const response = await chrome.tabs.sendMessage(tab[0].id!, { topic, mesage });
        return response
    }

    async sendMessageStorageUpdate() {
        await this.sendMessage(MESSAGE_TOPICS.STORAGE_UPDATE, "")
    }

    async getRemovedElements() {
        return extensionStorage.storage_get("removedElements")
    }

    async getFilterByResultsState() {
        return extensionStorage.storage_get("filterByResultState")
    }

    async setFilterByResultsState(state: true | false) {
        extensionStorage.storage_set("filterByResultState", state)
    }

    async requestElementSelectMode(mode: "ON" | "OFF") {
        await this.sendMessage(
            mode === "ON"
                ? MESSAGE_TOPICS.ELEMENT_SELECT_MODE_ON
                : MESSAGE_TOPICS.ELEMENT_SELECT_MODE_OFF
            , "")
    }
}

class ContentMediator extends Mediator implements IContentMediator {

    private urlsCache: Record<string, string> = {}
    private evaluationCache: Record<string, number> = {}

    private async sendMessage<T, U>(message: T): Promise<U> {
        const response = await chrome.runtime.sendMessage(message);
        return response as Promise<U>
    }
    async requestUrlHTML(message: { url: string }) {

        if (this.urlsCache[message.url]) {
            return this.urlsCache[message.url]
        }
        const response = await this.sendMessage<{ url: string }, string>({ url: message.url })
        if (response === "ERROR") {
            return null
        }
        this.urlsCache[message.url] = response;
        return response
    }

    async requestModelEvaluate(message: { sentence: string }) {

        if (this.evaluationCache[message.sentence]) {
            return this.evaluationCache[message.sentence]
        }
        const response = await this.sendMessage<{ sentence: string }, number>({ sentence: message.sentence })
        this.evaluationCache[message.sentence] = response;
        return response
    }

}


export interface IUIMediator extends Mediator {
    getRemovedElements(): Promise<string[]>
    getFilterByResultsState(): Promise<boolean>
    setFilterByResultsState(state: true | false): Promise<void>
    requestElementSelectMode(mode: "ON" | "OFF"): Promise<void>
    sendMessageStorageUpdate(): Promise<void>
}

export interface IContentMediator extends Mediator {
    requestUrlHTML(message: object): Promise<string | null>
    requestModelEvaluate(message: { sentence: string }): Promise<number>
}


export const contentMediator = new ContentMediator()
export const uiMediator = new UIMediator()
