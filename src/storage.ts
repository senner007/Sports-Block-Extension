export async function storage_get(index : string) : Promise<string[]> {
    console.log( chrome.storage )
    const result = await chrome.storage.sync.get(index)
    console.log("dsdsdddsds")
    return result[index];
}


export async function storage_set(index : string, value : string[]) {
    chrome.storage.sync.set({ [index]: value });
}


