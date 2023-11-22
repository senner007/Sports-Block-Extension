
import { all } from "@tensorflow/tfjs";
import { IContentMediator, MESSAGE_TOPICS, messageForm } from "../mediator";
import { IArticleElements, IContentView } from "./contentView";
import { removeChildNodes, removeTRailingFullStopAndSpace } from "../utils";

export class ContentController<TRoot, TElement> {

  public isEditMode: boolean = false;
  public isFilterByResults: boolean = true; // filter by results
  constructor(private contentView: IContentView<TRoot, TElement>, private contentMediator: IContentMediator, private host: { location : string, sportsSection : string, sportsPath : string}) {
    this.contentMediator.receiveListener(this.messageReceiverStorageUpdate)
    this.contentMediator.receiveListener(this.messageReceiverSelectMode)
  }

  createModal = () => {
    this.contentView.createModal(this.modalCallback)
  } 
  modalCallback= () => {
    this.messageReceiverSelectMode({topic : MESSAGE_TOPICS.ELEMENT_SELECT_MODE_OFF, message : "" })
  } 

  messageReceiverSelectMode = async (request: messageForm, sender?: any, sendResponse?: any) => {


    this.isEditMode = request.topic === MESSAGE_TOPICS.ELEMENT_SELECT_MODE_ON
    if (!this.isEditMode) {
      this.contentView.removeLocateListeners()
      this.contentView.closeModal();
    }
    await this.markElements(this.contentView.root)
    if (this.isEditMode) {
      this.contentView.addLocateListeners(this.locateListener)
      this.contentView.openModal();
    }
  }

  locateListener = async (href: string) => {
    const paths = href.replace(this.host.sportsPath, "")
    const locatedCategoriesSplit = paths.split("\/")
    .filter(name => name.length > 0)
    .filter((_: string, index: number, arr: string[]) => index < arr.length - 1)
    const categories = await this.getCategories()
    this.contentView.appendToModal(locatedCategoriesSplit)
    await this.contentMediator.setCategories(Array.from(new Set([...categories, ...locatedCategoriesSplit!])))

  }

  messageReceiverStorageUpdate = async (request: messageForm, sender: any, sendResponse: any) => {
    if (request.topic === MESSAGE_TOPICS.STORAGE_UPDATE) {
      this.markElements(this.contentView.root)
    }
  }

  async getCategories() {
    const categories = await this.contentMediator.getCategories()
    return categories || []
  }

  async findElementsOnPage(root: TRoot | TElement) {
    const elems = this.contentView.getElements(this.host.sportsSection, root);
    return elems
  }

  checkIfResults = async(elem : IArticleElements<TElement>) => {

    const urlRespponse = await this.contentMediator.requestUrlHTML({url: elem.href})

    if (urlRespponse == null) {
      return
    }

    const sentenceParsed = this.contentView.parseUrl(this.host.location, urlRespponse)
    const result = await this.contentMediator.requestModelEvaluate({sentence: sentenceParsed});
    console.log("PARSED :", sentenceParsed, "\nRESULT:",  result)

    const resultBoolean = result > 0.5
    if (resultBoolean === true) {
      this.contentView.hideElement(elem.elem)
    }
   
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
        const allLabels = elem.pathname!.split("\/").filter(label => label)
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
    categoryElems.forEach(async (elem) => {
      if (this.isFilterByResults) {
        this.checkIfResults(elem)
      } else {
        this.contentView.hideElement(elem.elem)
      }

    })
    notCategoryElems.forEach(elem => this.contentView.tagForRemoval(elem.elem, this.isEditMode ? "ON" : "OFF"))
  }

}
