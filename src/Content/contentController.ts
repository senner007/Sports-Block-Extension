
import { IContentMediator } from "../mediator";
import { IArticleElements, IContentView } from "./contentView";


export class ContentController {

  constructor(private contentView: IContentView, private contentMediator: IContentMediator) {

  }

  async getCategories() {
    const categories = await this.contentMediator.getCategories()
    return categories
  }
  async findElementsOnPage() {
    const host = window.location.host;  
    const elems = this.contentView.getElements(host);
    return elems
  }

  hideElement(elem : HTMLElement) {
    this.contentView.hideElement(elem)
  }

  locateElement(elem : HTMLElement) {
    this.contentView.locateElement(elem)
  }

  hideByCategory(categories : string[], elems : IArticleElements[]) {
    elems
     .filter(elem => categories.includes(elem.label!.toLowerCase()))
     .forEach(elem => this.hideElement(elem.elem))
  }

  locateForSelection(categories : string[], elems : IArticleElements[]) {
    elems
     .filter(elem => !categories.includes(elem.label!.toLowerCase()))
     .forEach(elem => this.locateElement(elem.elem))
  }


  

}
