import { Builder } from "../../src/creation";
import { MockFactory, EmptyCalendar, MockChat, MockStorage, MockTimer } from "../mocks";
import { UpdateConfigImpl, ReminderImpl, InitializeChatImpl, StartAssistantImpl } from "../../src/useCases";
import {
    CommunicationController,
    TriggerGateway,
    PeristenceGateway,
    CommunicationPresenter,
    CalendarGateway,
} from "../../src/gateways";

// All Classes where the prototype is checked need to have their own mock!
jest.mock("../../src/useCases/startAssistant");
jest.mock("../../src/useCases");
jest.mock("../../src/gateways/calendar/CalendarGateway");
jest.mock("../../src/gateways/communication/CommunicationController");
jest.mock("../../src/gateways/communication/CommunicationPresenter");
jest.mock("../../src/gateways/persistence/PersistenceGateway");
jest.mock("../../src/gateways/trigger/TriggerGateway");
jest.mock("../../src/gateways/trigger");
jest.mock("../mocks/external/MockChat");
jest.mock("../mocks/external/MockTimer");
jest.mock("../mocks/external");

describe("Builder", () => {
    describe("build", () => {
        beforeAll(() => {
            const mockFactory = new MockFactory();
            const builder = new Builder(mockFactory);
            builder.build({ calendar: {}, chatData: {}, storage: {} });
        });
        describe("external", () => {
            it("should create the external classes", () => {
                expect(EmptyCalendar).toHaveBeenCalledTimes(1);
                expect(MockChat).toHaveBeenCalledTimes(1);
                expect(MockStorage).toHaveBeenCalledTimes(1);
                expect(MockTimer).toHaveBeenCalledTimes(1);
            });
            it("should initialize the chat", () => {
                expect((MockChat as jest.Mock).mock.instances[0].init).toHaveBeenCalledTimes(1);
                const params = (MockChat as jest.Mock).mock.instances[0].init.mock.calls[0];
                expect(params[0]).toBeInstanceOf(CommunicationController);
            });
            it("should initialize the timer", () => {
                expect((MockTimer as jest.Mock).mock.instances[0].init).toHaveBeenCalledTimes(1);
                const params = (MockTimer as jest.Mock).mock.instances[0].init.mock.calls[0];
                expect(params[0]).toBeInstanceOf(TriggerGateway);
            });
        });
        describe("gateways", () => {
            it("should create the gateways", () => {
                expect(CalendarGateway).toHaveBeenCalledTimes(1);
                expect(CommunicationController).toHaveBeenCalledTimes(1);
                expect(CommunicationPresenter).toHaveBeenCalledTimes(1);
                expect(PeristenceGateway).toHaveBeenCalledTimes(1);
                expect(TriggerGateway).toHaveBeenCalledTimes(1);
            });
            it("should initialize the CalendarGateway", () => {
                expect((CalendarGateway as jest.Mock).mock.instances[0].init).toHaveBeenCalledTimes(1);
                const data = (CalendarGateway as jest.Mock).mock.instances[0].init.mock.calls[0][0];
                expect(data.calendarConnector).toBeInstanceOf(EmptyCalendar);
            });
            it("should initialize the CommunicationController", () => {
                expect((CommunicationController as jest.Mock).mock.instances[0].init).toHaveBeenCalledTimes(1);
                const data = (CommunicationController.prototype.init as jest.Mock).mock.calls[0][0];
                expect(data.useCases?.update).toBeInstanceOf(UpdateConfigImpl);
                expect(data.useCases?.init).toBeInstanceOf(InitializeChatImpl);
                expect(data.presenter).toBeInstanceOf(CommunicationPresenter);
            });
            it("should initialize the CommunicationPresenter", () => {
                expect((CommunicationPresenter as jest.Mock).mock.instances[0].init).toHaveBeenCalledTimes(1);
                const data = (CommunicationPresenter as jest.Mock).mock.instances[0].init.mock.calls[0][0];
                expect(data.communication).toBeInstanceOf(MockChat);
            });
            it("should initialize the PeristenceGateway", () => {
                expect((PeristenceGateway as jest.Mock).mock.instances[0].init).toHaveBeenCalledTimes(1);
                const data = (PeristenceGateway as jest.Mock).mock.instances[0].init.mock.calls[0][0];
                expect(data.persistence).toBeInstanceOf(MockStorage);
            });
            it("should initialize the TriggerGateway", () => {
                expect((TriggerGateway as jest.Mock).mock.instances[0].init).toHaveBeenCalledTimes(1);
                const data = (TriggerGateway as jest.Mock).mock.instances[0].init.mock.calls[0][0];
                expect(data.triggerConfig).toBeInstanceOf(MockTimer);
                expect(data.reminder).toBeInstanceOf(ReminderImpl);
            });
        });
        describe("use cases", () => {
            it("should create the initialize chat use case", () => {
                expect(InitializeChatImpl).toHaveBeenCalledTimes(1);
                const params = (InitializeChatImpl as jest.Mock).mock.calls[0];
                expect(params[0]).toBeInstanceOf(CommunicationPresenter);
                expect(params[1]).toBeInstanceOf(PeristenceGateway);
            });
            it("should create the reminder use case", () => {
                expect(ReminderImpl).toHaveBeenCalledTimes(1);
                const params = (ReminderImpl as jest.Mock).mock.calls[0];
                expect(params[0]).toBeInstanceOf(CalendarGateway);
                expect(params[1]).toBeInstanceOf(CommunicationPresenter);
            });
            it("should create the start assistant use case", () => {
                expect(StartAssistantImpl).toHaveBeenCalledTimes(1);
                const params = (StartAssistantImpl as jest.Mock).mock.calls[0];
                expect(params[0]).toBeInstanceOf(TriggerGateway);
                expect(params[1]).toBeInstanceOf(PeristenceGateway);
            });
            it("should create the update config use case", () => {
                expect(UpdateConfigImpl).toHaveBeenCalledTimes(1);
                const params = (UpdateConfigImpl as jest.Mock).mock.calls[0];
                expect(params[0]).toBeInstanceOf(CommunicationPresenter);
                expect(params[1]).toBeInstanceOf(TriggerGateway);
                expect(params[2]).toBeInstanceOf(PeristenceGateway);
            });
            it("should execute the start assistant use case", () => {
                expect((StartAssistantImpl as jest.Mock).mock.instances[0].execute).toHaveBeenCalledTimes(1);
            });
        });
    });
});
