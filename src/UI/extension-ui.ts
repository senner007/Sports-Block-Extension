import { uiMediator } from "../mediator"
import { UIController } from "./uiController"
import { uiView } from "./uiView"

const constroller = new UIController(uiView, uiMediator);




console.log("This is the UI console!")

// function doBeforeLoad(event: any){
//     // console.log("dsdsd")
// }

// function receiver (request: any, sender: any, sendResponse: (message : any) => void) {
//   console.log("request received in ui:")
//   console.log(request)
// }

// uiMediator.receiveListener(receiver)

// // uiMediator.sendMessage("new labels for storage from popup")

// document.addEventListener('beforeload', doBeforeLoad , true);

// document.querySelector('li')!.addEventListener("click", () => {
//     console.log("clicked")
// })