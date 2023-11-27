import { IContentMediator, MESSAGE_TOPICS, messageForm } from "../mediator";
import { IArticleElements, IContentView } from "./contentView";
import { TypeHost } from "./extension-content";

export class ContentController<TRoot, TElement> {

  private isSelectMode: boolean = false;
  private isFilterResultsOnly: boolean = false; // filter by results
  constructor(private contentView: IContentView<TRoot, TElement>, private contentMediator: IContentMediator, private host: TypeHost) {
    this.contentMediator.receiveListener(this.messageReceiverStorageUpdate)
    this.contentMediator.receiveListener(this.messageReceiverSelectMode)
    this.contentMediator.receiveListener(this.messageReceiverfilterByResults)
    this.contentMediator.receiveListener(this.messageReceiverGetElementsRemoved)
  }

  async init() {
    this.isFilterResultsOnly = await this.contentMediator.getFilterByResultsState();
    await this.markElements(this.contentView.root)
    setTimeout(() => { // execute after DOM update
      this.observeElements(async (elem : TElement) => {
        await this.markElements(elem);
        const elems = await this.findRelatedElems(elem);
        if (elems.elemsToBeHidden.length > 0) {
          this.contentMediator.DomChangeUpdate()
        }
      });
    }, 0);
    this.createModal();
  }

  messageReceiverGetElementsRemoved = (request: messageForm, sender?: any, sendResponse?: any) => {
    if (MESSAGE_TOPICS.GET_ELEMENTS_REMOVED) {
      (async () => {
        const elems = await this.findRelatedElems(this.contentView.root);
        sendResponse(elems.elemsToBeHidden!.map(elem => ({url : elem.href!, labels : this.host.getLabels(elem.href!)})))
      })();
      return true;
    }
  }

  createModal = () => {
    this.contentView.createModal(this.modalCallback)
  }

  modalCallback = () => {
    this.messageReceiverSelectMode({ topic: MESSAGE_TOPICS.ELEMENT_SELECT_MODE_OFF, message: "" })
  }

  messageReceiverSelectMode = async (request: messageForm, sender?: any, sendResponse?: any) => {
    if (request.topic === MESSAGE_TOPICS.ELEMENT_SELECT_MODE_ON || request.topic === MESSAGE_TOPICS.ELEMENT_SELECT_MODE_OFF) {
      this.isSelectMode = request.topic === MESSAGE_TOPICS.ELEMENT_SELECT_MODE_ON
      await this.markElements(this.contentView.root)
      if (this.isSelectMode) {
        this.contentView.openModal();
      }
      else {
        this.contentView.closeModal();
      }
    }
  }

  locateForRemovalListener = async (href: string) => {
    let locatedCategoriesSplit = this.host.getLabels(href)
    const categories = await this.getCategories()
    this.contentView.appendToModal(locatedCategoriesSplit)
    await this.contentMediator.setCategories(Array.from(new Set([...categories, ...locatedCategoriesSplit]))) // TODO filter unique in mediator

  }

  messageReceiverStorageUpdate = async (request: messageForm, sender: any, sendResponse: any) => {
    if (request.topic === MESSAGE_TOPICS.STORAGE_UPDATE) {
      await this.markElements(this.contentView.root)
      setTimeout(() => {
        this.contentMediator.DomChangeUpdate()
      },0)
    }
  }

  messageReceiverfilterByResults = async (request: messageForm, sender: any, sendResponse: any) => {
    if (request.topic === MESSAGE_TOPICS.FILTER_BY_RESULTS_MODE_ON || request.topic === MESSAGE_TOPICS.FILTER_BY_RESULTS_MODE_OFF) {
      this.isFilterResultsOnly = request.topic === MESSAGE_TOPICS.FILTER_BY_RESULTS_MODE_ON
      await this.markElements(this.contentView.root)
      setTimeout(() => {
        this.contentMediator.DomChangeUpdate()
      },0)
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

  checkIfResults = async (elem: IArticleElements<TElement>) => {

    const urlRespponse = await this.contentMediator.requestUrlHTML({ url: elem.href })

    if (urlRespponse === null) {
      return false
    }

    const sentenceParsed = this.contentView.parseUrl(this.host, urlRespponse)
    const result = await this.contentMediator.requestModelEvaluate({ sentence: sentenceParsed });
    console.log("PARSED :", sentenceParsed, "\nRESULT:", result)

    return result > 0.5

  }

  observeElements(callback: (elem: TElement) => Promise<void>) {
    this.contentView.observeElements(callback)
  }


  findRelatedElems = async (rootOrElem: TRoot | TElement) => {
    const categories = await this.getCategories();

    const elems = await this.findElementsOnPage(rootOrElem)
    if (elems.length === 0) {
      return { elemsToBeHidden : [], remaining: [] }
    }

    const categoryElems = elems
      .filter(elem => {
        const allLabels = this.host.getLabels(elem.href!)
        for (const label of allLabels) {
          if (categories.includes(label.toLowerCase())) {
            return true;
          }
        }
        return false;
      });

    const notCategoryElems = elems
      .filter(elem => !categoryElems.map(e => e.href).includes(elem.href));

    const elemsToBeHidden: IArticleElements<TElement>[] = []

    for (const categoryElement of categoryElems) {
      if (!this.isFilterResultsOnly) {
        elemsToBeHidden.push(categoryElement)
      }
      else {
        const isResult = await this.checkIfResults(categoryElement);
        if (isResult) {
          elemsToBeHidden.push(categoryElement)
        }
      }
    }


    return  { elemsToBeHidden, remaining: notCategoryElems, allElems : elems }
  }

  markElements = async (rootOrElem: TRoot | TElement) => {

    const elems = await this.findRelatedElems(rootOrElem);
    elems.allElems?.forEach(elem => this.contentView.clearSelection(elem.elem))
    elems.elemsToBeHidden.forEach(elem => this.contentView.hideElement(elem.elem));
    elems.remaining.forEach(elem => this.contentView.tagForRemoval(elem.elem, this.isSelectMode ? "ON" : "OFF", this.locateForRemovalListener))
  }

}
