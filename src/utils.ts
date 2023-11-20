
export function removeChildNodes(elem : HTMLElement) {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
}