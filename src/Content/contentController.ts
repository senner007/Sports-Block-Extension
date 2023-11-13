
import { IContentMediator } from "../mediator";
import { IArticleElements, IContentView } from "./contentView";

export class ContentController<TRoot, TElement> {

  public isEditMode: boolean = true;
  constructor(private contentView: IContentView<TRoot, TElement>, private contentMediator: IContentMediator, private host : string) {
  
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

  async markElementsInit() {
    await this.markElements(this.contentView.root)
  }

  markElements = async (root: TRoot | TElement) => {
    const elems = await this.findElementsOnPage(root)
    if (!elems.length) {
      return
    }
    const categories = await this.getCategories();
    const categoryElems = elems
      .filter(elem => categories.includes(elem.label!.toLowerCase()));

    const notCategoryElems = elems
      .filter(elem => !categories.includes(elem.label!.toLowerCase()));
    
    elems.forEach(elem => this.contentView.clearSelection(elem.elem))  
    categoryElems.forEach(elem => this.contentView.hideElement(elem.elem))
    notCategoryElems.forEach(elem => this.contentView.tagForRemoval(elem.elem, this.isEditMode ? "ON" : "OFF"))
  }

}
