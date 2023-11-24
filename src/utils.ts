
export function removeChildNodes(elem : HTMLElement) {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
}

export function removeTRailingFullStopAndSpace(str: string) {
    let trimmed = str.trim();
    if (trimmed[trimmed.length-1] === ".")
        trimmed = trimmed.slice(0,-1);

    return trimmed;
}
