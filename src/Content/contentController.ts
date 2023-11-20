
import { all } from "@tensorflow/tfjs";
import { IContentMediator, MESSAGE_TOPICS, messageForm } from "../mediator";
import { IArticleElements, IContentView } from "./contentView";

export class ContentController<TRoot, TElement> {

  public isEditMode: boolean = false;
  constructor(private contentView: IContentView<TRoot, TElement>, private contentMediator: IContentMediator, private host: { location : string, sportsSection : string, sportsPath : string}) {
    this.contentMediator.receiveListener(this.messageReceiverStorageUpdate)
    this.contentMediator.receiveListener(this.messageReceiverSelectMode)
    // this.createModal();
  }

  createModal = () => {
    var div = document.createElement("div");
    div.classList.add("modal")
    div.id = "myModal"
    div.innerHTML = `<div class="modal-content">
        <span class="close">&times;</span>
    </div>`
    document.body.appendChild(div);
    
    document.querySelector("#myModal span")?.addEventListener("click", () => {
      // div.style.display = "none";
      // this.isEditMode = false;
      this.closeModal();
      this.messageReceiverSelectMode({topic : MESSAGE_TOPICS.ELEMENT_SELECT_MODE_OFF, message : "" })
    });
  }

  appendToModal = (link : string[]) => {
    const modalContent = document.querySelector(".modal-content")!;
    for (const l of link) {
      var div = document.createElement("div");
      div.innerHTML = l
      modalContent.appendChild(div)
    }

  }

  openModal = () => {
    const modal = document.querySelector("#myModal") as HTMLElement
    modal!.style.display = "block";
  }

  closeModal = () => {
    const modal = document.querySelector("#myModal") as HTMLElement
    modal!.style.display = "none";

}

  messageReceiverSelectMode = async (request: messageForm, sender?: any, sendResponse?: any) => {

    this.isEditMode = request.topic === MESSAGE_TOPICS.ELEMENT_SELECT_MODE_ON
    if (!this.isEditMode) {
      this.contentView.removeLocateListeners()
      this.closeModal();
    }
    await this.markElements(this.contentView.root)
    if (this.isEditMode) {
      this.contentView.addLocateListeners(this.locateListener)
      this.openModal();
    }
  }

  locateListener = async (href: string) => {
    const paths = href.replace(this.host.sportsPath, "")
    const locatedCategoriesSplit = paths.split("\/")
    .filter(name => name.length > 0)
    .filter((_: string, index: number, arr: string[]) => index < arr.length - 1)
    const categories = await this.contentMediator.getCategories()
    console.log(locatedCategoriesSplit)
    this.appendToModal(locatedCategoriesSplit)
    await this.contentMediator.setCategories(Array.from(new Set([...categories, ...locatedCategoriesSplit!])))

  }

  messageReceiverStorageUpdate = async (request: messageForm, sender: any, sendResponse: any) => {
    if (request.topic === MESSAGE_TOPICS.STORAGE_UPDATE) {
      this.markElements(this.contentView.root)
    }
  }

  async getCategories() {
    const categories = await this.contentMediator.getCategories()
    return categories
  }

  async findElementsOnPage(root: TRoot | TElement) {
    const elems = this.contentView.getElements(this.host.sportsSection, root);
    return elems
  }


  observeElements(callback: (elem: TElement) => Promise<void>) {
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
