import { expect, test, describe, vi,beforeEach, Mock } from "vitest";
import { ContentController } from "../src/Content/contentController";
import { ContentMediatorMock, ContentViewMock } from "./__mocks/contentControllerMocks";
import { TypeHost } from "../src/Content/extension-content";


const host = {
    location : "www.fake.com",
    sportsSection : "www.fake.com" + "/fake-sport",
    sportsPath : "/fake-sport",
    getLabels(href: string) {
        const paths = href.replace(this.sportsPath, "")
        const lanbels = paths.split("\/")
        .filter(name => name.length > 0)
        .filter((_: string, index: number, arr: string[]) => index < arr.length - 1) 
        return lanbels.length === 0 ? ["Sport"] : lanbels
    },
    parser(hostInfo : TypeHost, html: string) : string {
            return ""
    }
}

describe("Test ContentController methods", () => {
    
    test('should instantiate', () => {
        new ContentController(new ContentViewMock(), new ContentMediatorMock(), host)
    })

    test('should get categories from mediator and hide elements with categories', async () => {

        // Arrange
        const controllerViewMock = new ContentViewMock();
        const mediatorMock = new ContentMediatorMock()
        mediatorMock.setCategories(["fake-category1", "fake-category2"])

        // Act
        const controller = new ContentController<{ elems : { href : string, pathname : string, isHidden : boolean}[]}, object>(controllerViewMock, mediatorMock, host)
        await controller.init();

        // Assert
        expect(controllerViewMock.root.elems.filter(e => e.isHidden).length).to.equal(2)
    });

    test('should observe view for incoming changes and act accordingly', async () => {

    
        // Arrange
        vi.useFakeTimers({ shouldAdvanceTime: true });
        const controllerViewMock = new ContentViewMock();
        const mediatorMock = new ContentMediatorMock()
        mediatorMock.setCategories(["fake-category1", "fake-category2"]);
        const mock = vi.spyOn(mediatorMock, "DomChangeUpdate");
        
        // Act
        const controller = new ContentController<{ elems : { href : string, pathname : string, isHidden : boolean}[]}, object>(controllerViewMock, mediatorMock, host)
        await controller.init();

        // Assert
        expect(controllerViewMock.root.elems.filter(e => e.isHidden).length).to.equal(2);
        await vi.advanceTimersByTimeAsync(1500)
        expect(controllerViewMock.root.elems.filter(e => e.isHidden).length).to.equal(3);
        expect(mock).toBeCalledTimes(1);

    })
});