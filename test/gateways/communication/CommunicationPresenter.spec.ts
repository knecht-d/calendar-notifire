// import { Mappings } from "./Mappings";

import { CommunicationPresenter } from "../../../src/gateways";
import { CommunicationError } from "../../../src/gateways/communication/CommunicationError";

jest.mock("../../../src/gateways/communication/Mappings", () => {
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

    describe("sendReadConfig", () => {
        it("should send the triggers", () => {
            const presenter = new CommunicationPresenter();
            presenter.init({ communication: mockCommunicationOut });
            const mockTriggers = { trigger: { mock: "trigger" }, trigger2: { mock: "trigger2" } };
            presenter.sendReadConfig("someChat", mockTriggers as any);
            expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                "someChat",
                JSON.stringify(mockTriggers, null, "  "),
            );
        });
    });

    describe("sendDeleteConfigSuccess", () => {
        it("should send a plain success message to the chat", () => {
            const presenter = new CommunicationPresenter();
            presenter.init({ communication: mockCommunicationOut });
            presenter.sendDeleteConfigSuccess("someChat", "someTrigger");
            expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Löschen von someTrigger erfolgreich.");
        });
        it("should add the additional message", () => {
            const presenter = new CommunicationPresenter();
            presenter.init({ communication: mockCommunicationOut });
            presenter.sendDeleteConfigSuccess("someChat", "someTrigger", "Details");
            expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                "someChat",
                "Löschen von someTrigger erfolgreich. Details",
            );
        });
    });
    describe("sendDeleteConfigError", () => {
        it("should send a plain error message to the chat", () => {
            const presenter = new CommunicationPresenter();
            presenter.init({ communication: mockCommunicationOut });
            presenter.sendDeleteConfigError("someChat", "someTrigger");
            expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                "someChat",
                "Fehler: Löschen von someTrigger fehlgeschlagen.",
            );
        });
        it("should add the additional message", () => {
            const presenter = new CommunicationPresenter();
            presenter.init({ communication: mockCommunicationOut });
            presenter.sendDeleteConfigError("someChat", "someTrigger", "Details");
            expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                "someChat",
                "Fehler: Löschen von someTrigger fehlgeschlagen - Details",
            );
        });
    });
    describe("sendSetConfigSuccess", () => {
        it("should send a plain success message to the chat", () => {
            const presenter = new CommunicationPresenter();
            presenter.init({ communication: mockCommunicationOut });
            presenter.sendSetConfigSuccess("someChat", "someTrigger");
            expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Setzen von someTrigger erfolgreich.");
        });
        it("should add the additional message", () => {
            const presenter = new CommunicationPresenter();
            presenter.init({ communication: mockCommunicationOut });
            presenter.sendSetConfigSuccess("someChat", "someTrigger", "Details");
            expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                "someChat",
                "Setzen von someTrigger erfolgreich. Details",
            );
        });
    });
    describe("sendSetConfigError", () => {
        it("should send a plain error message to the chat", () => {
            const presenter = new CommunicationPresenter();
            presenter.init({ communication: mockCommunicationOut });
            presenter.sendSetConfigError("someChat", "someTrigger");
            expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                "someChat",
                "Fehler: Setzen von someTrigger fehlgeschlagen.",
            );
        });
        it("should add the additional message", () => {
            const presenter = new CommunicationPresenter();
            presenter.init({ communication: mockCommunicationOut });
            presenter.sendSetConfigError("someChat", "someTrigger", "Details");
            expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                "someChat",
                "Fehler: Setzen von someTrigger fehlgeschlagen - Details",
            );
        });
    });
    describe("sendInitSuccess", () => {
        it("should send a plain success message to the chat", () => {
            const presenter = new CommunicationPresenter();
            presenter.init({ communication: mockCommunicationOut });
            presenter.sendInitSuccess("someChat");
            expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Erzeugen des Chats erfolgreich.");
        });
        it("should add the additional message", () => {
            const presenter = new CommunicationPresenter();
            presenter.init({ communication: mockCommunicationOut });
            presenter.sendInitSuccess("someChat", "Details");
            expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                "someChat",
                "Erzeugen des Chats erfolgreich. Details",
            );
        });
    });
    describe("sendInitError", () => {
        it("should send a plain error message to the chat", () => {
            const presenter = new CommunicationPresenter();
            presenter.init({ communication: mockCommunicationOut });
            presenter.sendInitError("someChat");
            expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                "someChat",
                "Fehler: Erzeugen des Chats fehlgeschlagen.",
            );
        });
        it("should add the additional message", () => {
            const presenter = new CommunicationPresenter();
            presenter.init({ communication: mockCommunicationOut });
            presenter.sendInitError("someChat", "Details");
            expect(mockCommunicationOut.send).toHaveBeenCalledWith(
                "someChat",
                "Fehler: Erzeugen des Chats fehlgeschlagen - Details",
            );
        });
    });
    describe("sendError", () => {
        it("should send error with 'Fehler:'", () => {
            const presenter = new CommunicationPresenter();
            presenter.init({ communication: mockCommunicationOut });
            presenter.sendError("someChat", "reason");
            expect(mockCommunicationOut.send).toHaveBeenCalledWith("someChat", "Fehler: reason");
        });
    });
    describe("sendCommunicationError", () => {
        it("should replace all properties", () => {
            const presenter = new CommunicationPresenter();
            presenter.init({ communication: mockCommunicationOut });
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
            const presenter = new CommunicationPresenter();
            presenter.init({ communication: mockCommunicationOut });
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
            const presenter = new CommunicationPresenter();
            presenter.init({ communication: mockCommunicationOut });
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
            const presenter = new CommunicationPresenter();
            presenter.init({ communication: mockCommunicationOut });
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
    describe("sendEvents", () => {
        it("should send the events", () => {
            const presenter = new CommunicationPresenter();
            presenter.init({ communication: mockCommunicationOut });
            presenter.sendEvents("someChat", [
                {
                    start: new Date(2020, 4, 1, 12, 0),
                    end: new Date(2020, 4, 1, 12, 0),
                    title: "Event",
                },
            ]);
            expect(mockCommunicationOut.send).toMatchSnapshot();
        });
    });
});
