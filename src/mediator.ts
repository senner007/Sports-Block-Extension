

class Mediator {

    async sendMessage(message: string, receiver : "content" | "ui") {
        const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
        const response = await chrome.tabs.sendMessage(tab.id!, {message, receiver});
        return response
    }

    async receiveListener(
        listener : (request: any, sender: any, sendResponse: (message : any) => void) => void 
        ) {
            chrome.runtime.onMessage.addListener(listener)
    }

}

export const mediator = new Mediator()