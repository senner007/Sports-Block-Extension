interface storagetypes {
    "categories" : string[]
    "removedElements" : string[]
    "filterByResultState" : boolean  
}

type storagetypeskeys = keyof storagetypes

class ExtensionStorage {
    async storage_get<T extends storagetypeskeys>(index : T) : Promise<storagetypes[T]> {
        const result = await chrome.storage.sync.get(index)
        return result[index];
    }
    
    async storage_set<T extends storagetypeskeys>(index : T, value : storagetypes[T]) : Promise<void> {
        chrome.storage.sync.set({ [index]: value });
    }    
}

export const extensionStorage = new ExtensionStorage();

