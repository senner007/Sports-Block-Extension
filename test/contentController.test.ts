import { expect, test, describe } from "vitest";
import { ContentController } from "../src/Content/contentController";
import { ContentMediatorMock, ContentViewMock } from "./__mocks/contentControllerMocks";

const host = {
    location : "window.location.host",
    sportsSection : "window.location.host" + "/sporten",
    sportsPath : "/sporten"
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