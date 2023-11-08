


console.log("This is a popup!")

function doBeforeLoad(event: any){
    console.log("dsdsd")
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      if (request.greeting === "hello")
        sendResponse({farewell: "goodbye"});
    }
);


(async () => {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id!, {greeting: "new labels for storage from popup"});
    // do something with response here, not outside the function
    console.log(response);

  })();

document.addEventListener('beforeload', doBeforeLoad , true);

document.querySelector('li')!.addEventListener("click", () => {
    console.log("clicked")
})