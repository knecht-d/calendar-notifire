import { CommunicationPresenter } from "./CommunicationPresenter";
import { CommunicationError } from "./CommunicationError";
// import { Mappings } from "./Mappings";

jest.mock("./Mappings", () => {
    // Works and lets you check for constructor calls:
    return {
        Mappings: {
            errorCodes: {
                GIVEN_EXPECTED_EXAMPLE: "Some Code: Given [{given}] Expected: {expected} Example: {example}",
                NO_EXAMPLE: "Some Code: Given [{given}] Expected: {expected}",
                NO_EXPECTED: "Some Code: Given [{given}] Example: {example}",
                DUPLICATE_GIVEN: "Some Code: Given [{given}] Expected: {expected} Given [{given}]",
            },
        },
    };
});
describe("CommunicationPresenter", () => {
    const mockCommunicationOut = {
        send: jest.fn(),
    };
    beforeEach(() => {
        mockCommunicationOut.send.mockClear();
    });
    describe("sendUpdateSuccess", () => {
        it("should send a plain success message to the chat", () => {
            const presenter = new CommunicationPresenter(mockCommunicationOut);
            presenter.sendUpdateSuccess("someChat", "someTrigger");
            expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Update someTrigger erfolgreich.");
        });
        it("should add the additional message", () => {
            const presenter = new CommunicationPresenter(mockCommunicationOut);
            presenter.sendUpdateSuccess("someChat", "someTrigger", "Details");
            expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                "someChat",
                "Update someTrigger erfolgreich. Details",
            );
        });
    });
    describe("sendUpdateError", () => {
        it("should send a plain error message to the chat", () => {
            const presenter = new CommunicationPresenter(mockCommunicationOut);
            presenter.sendUpdateError("someChat", "someTrigger");
            expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                "someChat",
                "Fehler: Update someTrigger fehlgeschlagen.",
            );
        });
        it("should add the additional message", () => {
            const presenter = new CommunicationPresenter(mockCommunicationOut);
            presenter.sendUpdateError("someChat", "someTrigger", "Details");
            expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                "someChat",
                "Fehler: Update someTrigger fehlgeschlagen - Details",
            );
        });
    });
    describe("sendError", () => {
        it("should send error with 'Fehler:'", () => {
            const presenter = new CommunicationPresenter(mockCommunicationOut);
            presenter.sendError("someChat", "reason");
            expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Fehler: reason");
        });
    });
    describe("sendCommunicationError", () => {
        it("should replace all properties", () => {
            const presenter = new CommunicationPresenter(mockCommunicationOut);
            presenter.sendCommunicationError(
                "someChat",
                new CommunicationError("GIVEN_EXPECTED_EXAMPLE" as any, "-given-", "-expected-", "-example-"),
            );
            expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                "someChat",
                "Fehler: Some Code: Given [-given-] Expected: -expected- Example: -example-",
            );
        });
        it("should replace only given and expected", () => {
            const presenter = new CommunicationPresenter(mockCommunicationOut);
            presenter.sendCommunicationError(
                "someChat",
                new CommunicationError("NO_EXAMPLE" as any, "-given-", "-expected-"),
            );
            expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                "someChat",
                "Fehler: Some Code: Given [-given-] Expected: -expected-",
            );
        });
        it("should only replace the placeholders", () => {
            const presenter = new CommunicationPresenter(mockCommunicationOut);
            presenter.sendCommunicationError(
                "someChat",
                new CommunicationError("NO_EXPECTED" as any, "-given-", "-expected-", "-example-"),
            );
            expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                "someChat",
                "Fehler: Some Code: Given [-given-] Example: -example-",
            );
        });
        it("should only replace all duplicated placeholders", () => {
            const presenter = new CommunicationPresenter(mockCommunicationOut);
            presenter.sendCommunicationError(
                "someChat",
                new CommunicationError("DUPLICATE_GIVEN" as any, "-given-", "-expected-", "-example-"),
            );
            expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                "someChat",
                "Fehler: Some Code: Given [-given-] Expected: -expected- Given [-given-]",
            );
        });
    });
});
