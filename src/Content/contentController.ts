
import { all } from "@tensorflow/tfjs";
import { IContentMediator, MESSAGE_TOPICS, messageForm } from "../mediator";
import { IArticleElements, IContentView } from "./contentView";
import { removeChildNodes, removeTRailingFullStopAndSpace } from "../utils";

export class ContentController<TRoot, TElement> {

  public isEditMode: boolean = false;
  public isFilterByResults: boolean = false; // filter by results
  constructor(private contentView: IContentView<TRoot, TElement>, private contentMediator: IContentMediator, private host: { location : string, sportsSection : string, sportsPath : string}) {
    this.contentMediator.receiveListener(this.messageReceiverStorageUpdate)
    this.contentMediator.receiveListener(this.messageReceiverSelectMode)
    this.contentMediator.receiveListener(this.messageReceiverfilterByResults)
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

  messageReceiverfilterByResults = async (request: messageForm, sender: any, sendResponse: any) => {
    if (request.topic === MESSAGE_TOPICS.FILTER_BY_RESULTS_MODE_ON) {
      console.log("filter by results on")
      this.isFilterByResults = true
    } else if (request.topic === MESSAGE_TOPICS.FILTER_BY_RESULTS_MODE_OFF) {
      console.log("filter by results off")
      this.isFilterByResults = false;
    }
    this.markElements(this.contentView.root)
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
    this.isFilterByResults =  await this.contentMediator.getFilterByResultsState();
    await this.markElements(this.contentView.root)
    setTimeout(() => { // execute after DOM update
      this.observeElements(this.markElements)
    }, 0);
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
    
    for (const categoryElement of  categoryElems) {
      if (this.isFilterByResults) {
        await this.checkIfResults(categoryElement)
      } else {
        this.contentView.hideElement(categoryElement.elem)
      }
    }

    notCategoryElems.forEach(elem => this.contentView.tagForRemoval(elem.elem, this.isEditMode ? "ON" : "OFF"))
  }

}
