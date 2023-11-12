export interface IUIView {
    displayCategories(categories: string[]): void;
    displayRemovedElements(removedElements: string[]): void;
    displayFilterByResultsButton(toggle: "ON" | "OFF"): void;
    toggleElementSelectButton(callback: (toggle: "ON" | "OFF") => Promise<void>): void;
    toggleFilterByResultsButton(callback: (toggle: "ON" | "OFF") => Promise<void>): void;
}

class UIView implements IUIView {
    filterByReesultsId = "#toggleFilterByResults";
    categories = "#categories"
    elementSelectButton = "#elementSelectButton"

    displayCategories(categories: string[]): void {
        const elem = document.querySelector(this.categories)
        for (const category of categories) {
            var div = document.createElement("div");
            div.innerHTML = `<p>${category}</p>`
            elem?.appendChild(div)
        }
    }
    displayRemovedElements(removedElements: string[]): void {
        throw new Error("Method not implemented.");
    }
    displayFilterByResultsButton(toggle: "ON" | "OFF"): void {
        const elem = document.querySelector(this.filterByReesultsId);
        if (toggle === "ON") {
            elem?.classList.add("ON");
        } else {
            elem?.classList.remove("ON");
        }
    }
    toggleElementSelectButton(callback: (toggle: "ON" | "OFF") => Promise<void>): void {
        document.querySelector(this.elementSelectButton)?.addEventListener("click", async (e) => {
            const elem = e.target as HTMLElement;
            console.log(elem);
            // elem.classList.toggle("ON");
            callback("ON");
        });
    }
    toggleFilterByResultsButton(callback: (toggle: "ON" | "OFF") => Promise<void>): void {
        document.querySelector(this.filterByReesultsId)?.addEventListener("click", async (e) => {
            const elem = e.target as HTMLElement;
            console.log(elem);
            // elem.classList.toggle("ON");
            callback("ON");
        });
    }
}

export const uiView = new UIView() 
