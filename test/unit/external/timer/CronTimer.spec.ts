import { CronJob } from "cron";
import { CronTimer } from "../../../../src/external";

const CronJobMock = CronJob as jest.Mock<CronJob>;
jest.mock("cron");
describe("CronTimer", () => {
    const mockTriggerReceiver = {
        trigger: jest.fn(),
    };
    let timer: CronTimer;
    beforeEach(() => {
        mockTriggerReceiver.trigger.mockClear();
        timer = new CronTimer();
        CronJobMock.mockClear();
    });
    describe("setTrigger", () => {
        beforeEach(() => {
            timer.init(mockTriggerReceiver);
        });
        it("should start a trigger", () => {
            timer.setTrigger("someTrigger", "someCron");
            expect(CronJobMock).toHaveBeenCalledTimes(1);
            expect(CronJobMock).toHaveBeenLastCalledWith("someCron", expect.any(Function));
            expect(CronJobMock.mock.instances[0].start).toHaveBeenCalledTimes(1);
        });
        it("should notify the trigger receiver if the time elapsed", () => {
            timer.setTrigger("someTrigger", "someCron");
            expect(mockTriggerReceiver.trigger).not.toHaveBeenCalled();
            const callback = CronJobMock.mock.calls[0][1];
            callback();
            expect(mockTriggerReceiver.trigger).toHaveBeenCalledTimes(1);
            expect(mockTriggerReceiver.trigger).toHaveBeenCalledWith("someTrigger");
        });
        it("should start and notify multiple triggers", () => {
            timer.setTrigger("someTrigger", "someCron");
            timer.setTrigger("anotherTrigger", "someCron");
            expect(CronJobMock).toHaveBeenCalledTimes(2);
            expect(mockTriggerReceiver.trigger).not.toHaveBeenCalled();
            const callback1 = CronJobMock.mock.calls[0][1];
            const callback2 = CronJobMock.mock.calls[1][1];
            callback1();
            callback2();
            expect(mockTriggerReceiver.trigger).toHaveBeenCalledTimes(2);
            expect(mockTriggerReceiver.trigger).toHaveBeenCalledWith("someTrigger");
            expect(mockTriggerReceiver.trigger).toHaveBeenCalledWith("anotherTrigger");
        });
    });
    describe("stopTrigger", () => {
        beforeEach(() => {
            timer.init(mockTriggerReceiver);
        });
        it("should stop a trigger", () => {
            timer.setTrigger("someTrigger", "someCron");
            timer.stopTrigger("someTrigger");
            expect(CronJobMock.mock.instances[0].stop).toHaveBeenCalledTimes(1);
        });
        it("should stop only the given trigger", () => {
            timer.setTrigger("someTrigger", "someCron");
            timer.setTrigger("anotherTrigger", "someCron");
            timer.stopTrigger("someTrigger");
            expect(CronJobMock.mock.instances[0].stop).toHaveBeenCalledTimes(1);
            expect(CronJobMock.mock.instances[1].stop).not.toHaveBeenCalled();
        });
    });
    it("should not call the trigger if it has not been initialized", () => {
        timer.setTrigger("someTrigger", "someCron");
        expect(mockTriggerReceiver.trigger).not.toHaveBeenCalled();
        const callback = CronJobMock.mock.calls[0][1];
        callback();
        expect(mockTriggerReceiver.trigger).not.toHaveBeenCalled();
    });
});
