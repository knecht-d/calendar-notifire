import { SetIntervalTimer } from "../../../../src/external";
import { MockLogger } from "../../../mocks/external/MockLogger";

jest.useFakeTimers();
describe("TestSetIntervalTimer", () => {
    const mockTriggerReceiver = {
        trigger: jest.fn(),
    };
    const mockLogger = new MockLogger();
    let timer: SetIntervalTimer;
    beforeEach(() => {
        mockTriggerReceiver.trigger.mockClear();
        timer = new SetIntervalTimer(mockLogger);
        (setInterval as jest.Mock).mockClear();
        (clearInterval as jest.Mock).mockClear();
    });
    afterEach(() => {
        jest.clearAllTimers();
    });
    describe("setTrigger", () => {
        beforeEach(() => {
            timer.init(mockTriggerReceiver);
        });
        it("should start a trigger", () => {
            timer.setTrigger("someTrigger", "someCron");
            expect(setInterval).toHaveBeenCalledTimes(1);
            expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);
            timer.stopTrigger("someTrigger");
        });
        it("should notify the trigger receiver if the time elapsed", () => {
            timer.setTrigger("someTrigger", "someCron");
            expect(mockTriggerReceiver.trigger).not.toHaveBeenCalled();
            jest.runOnlyPendingTimers();
            expect(mockTriggerReceiver.trigger).toHaveBeenCalledTimes(1);
            expect(mockTriggerReceiver.trigger).toHaveBeenCalledWith("someTrigger");
            timer.stopTrigger("someTrigger");
        });
        it("should start and notify multiple triggers", () => {
            timer.setTrigger("someTrigger", "someCron");
            timer.setTrigger("anotherTrigger", "someCron");
            expect(setInterval).toHaveBeenCalledTimes(2);
            expect(mockTriggerReceiver.trigger).not.toHaveBeenCalled();
            jest.runOnlyPendingTimers();
            expect(mockTriggerReceiver.trigger).toHaveBeenCalledTimes(2);
            expect(mockTriggerReceiver.trigger).toHaveBeenCalledWith("someTrigger");
            expect(mockTriggerReceiver.trigger).toHaveBeenCalledWith("anotherTrigger");
            timer.stopTrigger("someTrigger");
            timer.stopTrigger("anotherTrigger");
        });
    });
    describe("stopTrigger", () => {
        beforeEach(() => {
            timer.init(mockTriggerReceiver);
        });
        it("should stop a trigger", () => {
            timer.setTrigger("someTrigger", "someCron");
            expect(setInterval).toHaveBeenCalledTimes(1);
            expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);
            timer.stopTrigger("someTrigger");
            expect(clearInterval).toHaveBeenCalledTimes(1);
        });
        it("should stop only the given trigger", () => {
            timer.setTrigger("someTrigger", "someCron");
            timer.setTrigger("anotherTrigger", "someCron");
            jest.runOnlyPendingTimers();
            timer.stopTrigger("someTrigger");
            jest.runOnlyPendingTimers();

            expect(mockTriggerReceiver.trigger).toHaveBeenCalledTimes(3);
            expect(mockTriggerReceiver.trigger).toHaveBeenNthCalledWith(1, "someTrigger");
            expect(mockTriggerReceiver.trigger).toHaveBeenNthCalledWith(2, "anotherTrigger");
            expect(mockTriggerReceiver.trigger).toHaveBeenNthCalledWith(3, "anotherTrigger");

            timer.stopTrigger("anotherTrigger");
        });
    });
    it("should not call the trigger if it has not been initialized", () => {
        timer.setTrigger("someTrigger", "someCron");
        expect(mockTriggerReceiver.trigger).not.toHaveBeenCalled();
        jest.runOnlyPendingTimers();
        expect(mockTriggerReceiver.trigger).not.toHaveBeenCalled();
        timer.stopTrigger("someTrigger");
    });
});
