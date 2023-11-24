import { expect, test, describe } from "vitest";
import { ContentController } from "../src/Content/contentController";
import { ContentMediatorMock, ContentViewMock } from "./__mocks/contentControllerMocks";

const host = {
    location : "window.location.host",
    sportsSection : "window.location.host" + "/sporten",
    sportsPath : "/sporten",
    getLabels(href: string) {
        const paths = href.replace(this.sportsPath, "")
        const lanbels = paths.split("\/")
        .filter(name => name.length > 0)
        .filter((_: string, index: number, arr: string[]) => index < arr.length - 1) 
        return lanbels.length === 0 ? ["Sport"] : lanbels
    }
}


describe("Test ContentController methods", () => {
    test('should instantiate', () => {
        new ContentController(new ContentViewMock(), new ContentMediatorMock(), host)
    })

    test('should mark elements', async () => {
        const controllerViewMock = new ContentViewMock()
        const controller = new ContentController(controllerViewMock, new ContentMediatorMock(), host)
        await controller.init();
        expect(controllerViewMock.elems[0]).toBeTruthy();
    })

    test('should find elements', async () => {
        const controllerViewMock = new ContentViewMock()
        const controller = new ContentController(controllerViewMock, new ContentMediatorMock(), host)
        await controller.init();
        expect(controllerViewMock.elems[0]).toBeTruthy();
    })

});