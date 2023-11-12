
import { IUIMediator } from "../mediator";
import { IUIView } from "./uiView";


export class UIController {
  constructor(private UIView: IUIView, private uiMediator: IUIMediator) {
    console.log(uiMediator)
    UIView.toggleElementSelectButton(this.elementSelectModeToggle)
    UIView.toggleFilterByResultsButton(this.filterByResultsToggle)

    this.displayCategories()

  }

  // TODO find bedre navne, da den gøre mere end display

  displayCategories = async () => {
    const categories = await this.uiMediator.getCategories();
    this.UIView.displayCategories(categories);
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
    console.log(this)
    await this.uiMediator.requestElementSelectMode(mode);
  }

  filterByResultsToggle = async (mode: "ON" | "OFF") => {
    await this.uiMediator.setFilterByResultsState(mode === "ON" ? true : false);
  }
}
