import { extensionStorage } from "./storage";

export enum MESSAGE_TOPICS {
    ELEMENT_SELECT_MODE_ON,
    ELEMENT_SELECT_MODE_OFF,
    FILTER_BY_RESULTS_MODE_ON,
    FILTER_BY_RESULTS_MODE_OFF,
    CONTENT_DOM_CHANGE,
    GET_ELEMENTS_REMOVED,
    REQUEST_URL,
    REQUEST_MODEL_EVALUATION,
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

    async getFilterByResultsState() {
        return extensionStorage.storage_get("filterByResultState")
    }

}

class UIMediator extends Mediator implements IUIMediator {

    async getElemsRemoved(): Promise<{ url : string, labels : string[]}[]> {
        const result = await this.sendMessage(MESSAGE_TOPICS.GET_ELEMENTS_REMOVED, "")
        console.log(result)
        return result;
    }

    private async sendMessage(topic: MESSAGE_TOPICS, mesage: string) {
        const tab = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        const response = await chrome.tabs.sendMessage(tab[0].id!, { topic, mesage });
        console.log(response)
        return response
    }

    async sendMessageStorageUpdate() {
        await this.sendMessage(MESSAGE_TOPICS.STORAGE_UPDATE, "")
    }


    async setFilterByResultsState(mode: "ON" | "OFF") {
        await extensionStorage.storage_set("filterByResultState", mode === "ON" ? true : false )
        await this.sendMessage(
            mode === "ON"
                ? MESSAGE_TOPICS.FILTER_BY_RESULTS_MODE_ON
                : MESSAGE_TOPICS.FILTER_BY_RESULTS_MODE_OFF
            , "")

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
    private pending : Promise<string | null> = Promise.resolve("")
    private modelPending : Promise<number> = Promise.resolve(0)

    private async sendMessage<T, U>(topic : MESSAGE_TOPICS, message?: T): Promise<U> {
        const response = await chrome.runtime.sendMessage({ topic, message});
        return response as Promise<U>
    }
    async urlTaskrunner(message: { url: string }) : Promise<string | null> {
        // https://stackoverflow.com/questions/53540348/js-async-await-tasks-queue
        try {
            await this.pending;
        } finally {
            if (message.url in this.urlsCache) {
                return this.urlsCache[message.url]
            } else {
                try {
                    console.log("fetching")
                    const response = await this.sendMessage<{ url: string }, string>(MESSAGE_TOPICS.REQUEST_URL, { url: message.url })
                    this.urlsCache[message.url] = response;
                    if (response === "ERROR") {
                        
                        return null
                    }
                    return response
                } catch(err) {
                    console.log("fetch error:", err)
                    throw new Error();
                }
               
            }
        }

    }

    async modelTaskrunner(message: { sentence: string }) : Promise<number> {

        try {
            await this.modelPending;
        } finally {
            if (message.sentence in this.evaluationCache) {
                return this.evaluationCache[message.sentence]
            } else {
                const response = await this.sendMessage<{ sentence: string }, number>(MESSAGE_TOPICS.REQUEST_MODEL_EVALUATION, { sentence: message.sentence })
                this.evaluationCache[message.sentence] = response;
                return response
            }
        }

    }

    async requestUrlHTML(message: { url: string }) {

        this.pending = this.urlTaskrunner(message)
        return this.pending;
    }

    async requestModelEvaluate(message: { sentence: string }) {
        
        this.modelPending = this.modelTaskrunner(message)
        return this.modelPending;
    }

    async DomChangeUpdate() {
        
        await this.sendMessage<{}, number>(MESSAGE_TOPICS.CONTENT_DOM_CHANGE, {} )
    }

}


export interface IUIMediator extends Mediator {
    setFilterByResultsState(mode: "ON" | "OFF"): Promise<void>
    requestElementSelectMode(mode: "ON" | "OFF"): Promise<void>
    sendMessageStorageUpdate(): Promise<void>
    getElemsRemoved(): Promise<{ url : string, labels : string[]}[]>
}

export interface IContentMediator extends Mediator {
    requestUrlHTML(message: object): Promise<string | null>
    requestModelEvaluate(message: { sentence: string }): Promise<number>;
    DomChangeUpdate() : void


}


export const contentMediator = new ContentMediator()
export const uiMediator = new UIMediator()
