
import { all } from "@tensorflow/tfjs";
import { IContentMediator, MESSAGE_TOPICS, messageForm } from "../mediator";
import { IArticleElements, IContentView } from "./contentView";

export class ContentController<TRoot, TElement> {

  public isEditMode: boolean = false;
  constructor(private contentView: IContentView<TRoot, TElement>, private contentMediator: IContentMediator, private host : string) {
    this.contentMediator.receiveListener(this.messageReceiver)
    this.contentMediator.receiveListener(this.messageReceiverSelectMode)
  }

  messageReceiverSelectMode = async (request : messageForm, sender : any, sendResponse : any) => {

    this.isEditMode = request.topic === MESSAGE_TOPICS.ELEMENT_SELECT_MODE_ON 
    await this.markElements(this.contentView.root)
  }

  messageReceiver = async (request : MESSAGE_TOPICS, sender : any, sendResponse : any) => {
  }

  async getCategories() {
    const categories = await this.contentMediator.getCategories()
    return categories
  }

  async findElementsOnPage(root: TRoot | TElement) {
    const elems = this.contentView.getElements(this.host, root);
    return elems
  }

  observeElements(callback: (elem : TElement) => Promise<void>) {
    this.contentView.observeElements(callback)
  }

  async init() {
    await this.markElements(this.contentView.root)
    this.observeElements(this.markElements)
  }

  markElements = async (rootOrElem: TRoot | TElement) => {

    const categories = await this.getCategories();
  
    const elems = await this.findElementsOnPage(rootOrElem)
    if (!elems.length) {
      return
    }


    const categoryElems = elems
      .filter(elem => {
        const allLabels = elem.href!.split("\/")

        for (const label of allLabels) {
          if (categories.includes(label.toLowerCase())) {
            return true;
          }
        }
        return false;
      });

    const notCategoryElems = elems
      .filter(elem => !categoryElems.map(e => e.href).includes(elem.href));
    
    
    elems.forEach(elem => this.contentView.clearSelection(elem.elem))  
    categoryElems.forEach(elem => this.contentView.hideElement(elem.elem))
    notCategoryElems.forEach(elem => this.contentView.tagForRemoval(elem.elem, this.isEditMode ? "ON" : "OFF"))
  }

}
