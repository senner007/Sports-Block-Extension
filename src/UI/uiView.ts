import { removeChildNodes } from "../utils";

export interface IUIView {
    displayCategories(categories: string[]): void;
    displayRemovedElements(removedElements: string[]): void;
    displayFilterByResultsButton(toggle: "ON" | "OFF"): void;
    toggleElementSelectButton(callback: (toggle: "ON" | "OFF") => Promise<void>): void;
    toggleFilterByResultsButton(callback: (toggle: "ON" | "OFF") => Promise<void>): void;
    clickCategory(callback: (category: string) => Promise<void>): void
}

class UIView implements IUIView {
    filterByReesultsId = "#filterByResultsButton";
    categories = "#categories"
    elementSelectButton = "#elementSelectButton"
    category = ".category"

    displayCategories(categories: string[]): void {

        const elem = document.querySelector(this.categories)!
        removeChildNodes(elem as HTMLElement)

        for (const category of categories) {
            var div = document.createElement("div");
            div.innerHTML = `<p>${category}</p>`
            div.classList.add("category")
            elem?.appendChild(div)
        }
    }
    displayRemovedElements(removedElements: string[]): void {
        throw new Error("Method not implemented.");
    }
    displayFilterByResultsButton(toggle: "ON" | "OFF"): void {
        console.log("toggle" , toggle)
        const elem = document.querySelector(this.filterByReesultsId);
        if (toggle === "ON") {
            elem?.classList.add("ON");
        } else {
            elem?.classList.remove("ON");
        }
    }
    toggleElementSelectButton(callback: (toggle: "ON" | "OFF") => Promise<void>): void {
        document.querySelector(this.elementSelectButton)?.addEventListener("click", async (e) => {
            const target = e.target as HTMLElement;
            target.classList.toggle("ON");
            callback(target.classList.contains("ON") ? "ON" : "OFF");
        });
    }
    toggleFilterByResultsButton(callback: (toggle: "ON" | "OFF") => Promise<void>): void {
        document.querySelector(this.filterByReesultsId)?.addEventListener("click", async (e) => {
            const target = e.target as HTMLElement;
            target.classList.toggle("ON");
            callback(target.classList.contains("ON") ? "ON" : "OFF");
        });
    }
    clickCategory(callback: (category: string) => Promise<void>): void {
        const categories =  document.querySelectorAll(this.category)

        categories.forEach(elem => {
            elem.addEventListener("click", (e) => {
                const target = e.target as HTMLElement;
                const targetText = target.textContent!;
                callback(targetText)
            })
        })
    }
}

export const uiView = new UIView() 
