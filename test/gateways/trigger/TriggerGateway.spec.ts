import { TriggerGateway } from "../../../src/gateways";
import { RecurrenceType } from "../../../src/interfaces";

describe("TriggerGateway", () => {
    const mockTriggerConfigure = {
        setTrigger: jest.fn(),
    };
    const mockReminder = {
        execute: jest.fn(),
    };
    beforeEach(() => {
        mockTriggerConfigure.setTrigger.mockClear();
        mockReminder.execute.mockClear();
    });
    describe("update", () => {
        it("should encode the id", () => {
            const triggerGW = new TriggerGateway();
            triggerGW.init({ triggerConfig: mockTriggerConfigure, reminder: mockReminder });
            triggerGW.update("chat|Id", "trigger|Id", { type: RecurrenceType.monthly, day: 15, hour: 12, minute: 32 });
            expect(mockTriggerConfigure.setTrigger).toHaveBeenCalledWith("chat%7CId|trigger%7CId", expect.any(String));
        });
        it("should create a cron for monthly recurrence", () => {
            const triggerGW = new TriggerGateway();
            triggerGW.init({ triggerConfig: mockTriggerConfigure, reminder: mockReminder });
            triggerGW.update("chat|Id", "trigger|Id", { type: RecurrenceType.monthly, day: 15, hour: 12, minute: 32 });
            expect(mockTriggerConfigure.setTrigger).toHaveBeenCalledWith(expect.any(String), "32 12 15 * *");
        });
        it("should create a cron for daily recurrence", () => {
            const triggerGW = new TriggerGateway();
            triggerGW.init({ triggerConfig: mockTriggerConfigure, reminder: mockReminder });
            triggerGW.update("chat|Id", "trigger|Id", {
                type: RecurrenceType.daily,
                hour: 17,
                minute: 15,
                days: { monday: true, friday: true },
            });
            expect(mockTriggerConfigure.setTrigger).toHaveBeenCalledWith(expect.any(String), "15 17 * * 1,5");
        });
        it("should create a cron for hourly recurrence", () => {
            const triggerGW = new TriggerGateway();
            triggerGW.init({ triggerConfig: mockTriggerConfigure, reminder: mockReminder });
            triggerGW.update("chat|Id", "trigger|Id", {
                type: RecurrenceType.hourly,
                fromHour: 7,
                toHour: 19,
                minute: 45,
                days: { monday: true, wednesday: true, friday: true },
            });
            expect(mockTriggerConfigure.setTrigger).toHaveBeenCalledWith(expect.any(String), "45 7-19 * * 1,3,5");
        });
    });
    describe("trigger", () => {
        it("should fail if it was not initialized", () => {
            const triggerGW = new TriggerGateway();
            expect(() => {
                triggerGW.trigger("someID");
            }).toThrow("Not Initialized");
        });
        it("should execute the reminder with the decoded id", () => {
            const triggerGW = new TriggerGateway();
            triggerGW.init({ triggerConfig: mockTriggerConfigure, reminder: mockReminder });
            triggerGW.trigger("chat%7CId|trigger%7CId");
            expect(mockReminder.execute).toHaveBeenLastCalledWith({ chatId: "chat|Id", triggerId: "trigger|Id" });
        });
    });
});
