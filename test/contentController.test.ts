import { expect, test, describe } from "vitest";
import { ContentController } from "../src/Content/contentController";
import { contentMediatorMockInstance, contentViewMockInstance } from "./contentControllerMocks";


describe("Test ContentController methods", () => {
    test('should instantiate', () => {
        const host = "www.dr.dk"
        new ContentController(contentViewMockInstance, contentMediatorMockInstance, host)
    })

    test('should mark elements', async () => {
        const host = "www.dr.dk"
        const controller = new ContentController(contentViewMockInstance, contentMediatorMockInstance, host)
        await controller.markElementsInit();
        expect(contentViewMockInstance.elems[0]).toBeTruthy();
        
        

    })

});