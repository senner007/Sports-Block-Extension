import { expect, test, describe } from "vitest";
import { ContentController } from "../src/Content/contentController";
import { contentMediatorMockInstance, contentViewMockInstance } from "./contentControllerMocks";


describe("Test ContentController methods", () => {
    test('should instantiate', () => {
        const contentController = new ContentController(contentViewMockInstance, contentMediatorMockInstance)
    })

});