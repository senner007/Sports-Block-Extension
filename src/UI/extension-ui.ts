import { uiMediator } from "../mediator"
import { UIController } from "./uiController"
import { uiView } from "./uiView"

const constroller = new UIController(uiView, uiMediator);
console.log("This is the UI console!")
