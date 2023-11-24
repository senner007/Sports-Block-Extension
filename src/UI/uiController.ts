
import { IUIMediator } from "../mediator";
import { IUIView } from "./uiView";


export class UIController {

  constructor(private UIView: IUIView, private uiMediator: IUIMediator) {
    UIView.toggleElementSelectButton(this.elementSelectModeToggle)
    UIView.toggleFilterByResultsButton(this.filterByResultsToggle)
    this.uiMediator.requestElementSelectMode("OFF");
    this.displayFilterByResultsState()


    this.displayCategories().then(_ => {
      UIView.clickCategory(this.clickCategoryCallback)
    }) 

  }

  // TODO find bedre navne, da den gøre mere end display

  displayCategories = async () => {
    const categories = await this.uiMediator.getCategories();
    this.UIView.displayCategories(categories);

  }
  clickCategoryCallback = async (category: string) => {
    console.log(category)
    const categories = await this.uiMediator.getCategories();
    const filteredCategories = categories.filter(c => c !== category)
    await this.uiMediator.setCategories(filteredCategories);
    await this.uiMediator.sendMessageStorageUpdate();
    this.UIView.displayCategories(filteredCategories);
    this.UIView.clickCategory(this.clickCategoryCallback)
  }

  async displayRemovedElements() {

    const removedElements = await this.uiMediator.getRemovedElements();
    this.UIView.displayRemovedElements(removedElements);
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
