import { expect, test, describe } from "vitest";
import { UIController } from "../src/UI/uiController";
import { uiMediatorMock, uiViewMock } from "./__mocks/uiControllerMocks";

describe("Test UIController display methods", () => {
    test('should instantiate', () => {
        const uiController = new UIController(new uiViewMock(), new uiMediatorMock())
    })

    test('should execute displayCategories without errors', async () => {
        const uiController = new UIController(new uiViewMock(), new uiMediatorMock())
        await uiController.setupCategories()
    })

    test('should execute displayRemovedElements without errors', async () => {
        const uiController = new UIController(new uiViewMock(), new uiMediatorMock())
        await uiController.displayRemovedElements()
    })

    test('should execute displayFilterByResultsState without errors', async () => {
        const uiController = new UIController(new uiViewMock(), new uiMediatorMock())
        await uiController.displayFilterByResultsState()
    })

});

describe("Test UIController UI callback methods", () => { 

    test('should execute elementsSelectModeOn without errors', async () => {
          const uiController = new UIController(new uiViewMock(), new uiMediatorMock())
        await uiController.elementSelectModeToggle("ON")
    })

    test('should execute elementsSelectModeOff without errors', async () => {
          const uiController = new UIController(new uiViewMock(), new uiMediatorMock())
        await uiController.elementSelectModeToggle("OFF")
    })


    test('should execute filterResultsON without errors', async () => {
          const uiController = new UIController(new uiViewMock(), new uiMediatorMock())
        await uiController.filterByResultsToggle("ON")
    })

    test('should execute filterResultsOFF without errors', async () => {
          const uiController = new UIController(new uiViewMock(), new uiMediatorMock())
        await uiController.filterByResultsToggle("OFF")
    })

});