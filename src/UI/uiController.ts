
import { IUIMediator, MESSAGE_TOPICS, messageForm } from "../mediator";
import { IUIView } from "./uiView";

export class UIController {

  constructor(private UIView: IUIView, private uiMediator: IUIMediator) {
    UIView.toggleElementSelectButton(this.elementSelectModeToggle)
    UIView.toggleFilterByResultsButton(this.filterByResultsToggle)
    this.uiMediator.requestElementSelectMode("OFF");
    this.displayFilterByResultsState()
    this.displayRemovedElements();
    this.uiMediator.receiveListener(this.onContentDomChange)
    this.setupCategories();
  }

  setupCategories = async () => {
    const categories = await this.uiMediator.getCategories();
    this.UIView.displayCategories(categories);
    this.UIView.clickCategory(this.clickCategoryCallback)
  }

  // Refactor me!
  clickCategoryCallback = async (category: string) => {
    const categories = await this.uiMediator.getCategories();
    const filteredCategories = categories.filter(c => c !== category)
    await this.uiMediator.setCategories(filteredCategories);
    await this.uiMediator.sendMessageStorageUpdate();
    this.setupCategories();
  }

  async displayRemovedElements() {
    const removedElements = await this.uiMediator.getElemsRemoved();

    const unique = removedElements.filter(
          (obj, index) =>
          removedElements.findIndex((item) => item.url === obj.url) === index
        );
  
    this.UIView.displayRemovedElements(unique);
  }

  onContentDomChange = async (request: messageForm, sender?: any, sendResponse?: any) => {
    if ( request.topic === MESSAGE_TOPICS.CONTENT_DOM_CHANGE) {
      await this.displayRemovedElements();
    }
  }

  async displayFilterByResultsState() {
    const isFilterByResults = await this.uiMediator.getFilterByResultsState();
    this.UIView.displayFilterByResultsButton(isFilterByResults ? "ON" : "OFF");
  }

  elementSelectModeToggle = async (mode: "ON" | "OFF") => {
    await this.uiMediator.requestElementSelectMode(mode);
  }

  filterByResultsToggle = async (mode: "ON" | "OFF") => {
    await this.uiMediator.setFilterByResultsState(mode);
  }
}
