import { removeChildNodes } from "../utils";

export interface IUIView {
    displayCategories(categories: string[]): void;
    displayRemovedElements(removedElements: {url : string, labels : string[]}[]): void;
    displayFilterByResultsButton(toggle: "ON" | "OFF"): void;
    toggleElementSelectButton(callback: (toggle: "ON" | "OFF") => Promise<void>): void;
    toggleFilterByResultsButton(callback: (toggle: "ON" | "OFF") => Promise<void>): void;
    clickCategory(callback: (category: string) => Promise<void>): void
}

class UIView implements IUIView {
    filterByReesultsId = "#filterByResultsButton";
    resultsButton = document.querySelector(this.filterByReesultsId) as HTMLInputElement
    categories = "#categories"
    elementSelectButton = "#elementSelectButton"
    category = ".category"
    elementsRemoved = "#elementsRemoved"

    displayCategories(categories: string[]): void {

        const elem = document.querySelector(this.categories)!
        removeChildNodes(elem as HTMLElement)

        for (const category of categories) {
            var li = document.createElement("li");
            li.innerHTML = 
            `<span>
                <span class="categoryText">${category}</span>
                <span class="close">&times;</span>
            </span>`
            li.classList.add("category")
            elem?.appendChild(li)
        }
    }
    displayRemovedElements(removedElements: {url : string, labels : string[]}[]): void {
       const ul = document.querySelector(this.elementsRemoved) as HTMLUListElement;
       removeChildNodes(ul)
       for (const element of removedElements) {
        const li = document.createElement("li") as HTMLLIElement
        li.innerHTML = 
        `<span>
            <a href="${element.url}" target="_blank">${element.url}</a>
            <span>${element.labels.join(",")}</span>
        </span>`
        ul!.appendChild(li)
       }
        
    }
    displayFilterByResultsButton(toggle: "ON" | "OFF"): void {
        this.resultsButton.checked = toggle === "ON" ? true : false;
   
    }
    toggleElementSelectButton(callback: (toggle: "ON" | "OFF") => Promise<void>): void {
        document.querySelector(this.elementSelectButton)?.addEventListener("click", async (e) => {
            const target = e.target as HTMLElement;
            target.classList.toggle("ON");
            callback(target.classList.contains("ON") ? "ON" : "OFF");
        });
    }
    toggleFilterByResultsButton(callback: (toggle: "ON" | "OFF") => Promise<void>): void {
        this.resultsButton?.addEventListener("click", async (e) => {
            callback( (e.target! as HTMLInputElement).checked ? "ON" : "OFF");
        });
    }
    clickCategory(callback: (category: string) => Promise<void>): void {
        const categories =  document.querySelectorAll(this.category)

        categories.forEach(elem => {
            elem.addEventListener("click", (e) => {
                const target = (e.target as HTMLElement).closest('li')?.querySelector(".categoryText") as HTMLLIElement;
                const targetText = target.textContent!;
                callback(targetText)
            })
        })
    }
}

export const uiView = new UIView() 
