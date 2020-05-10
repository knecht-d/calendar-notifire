import { AbstractTimer } from "../../../src/external";

export class MockTimer extends AbstractTimer {
    setTrigger = jest.fn();
    stopTrigger = jest.fn();

    fireTrigger(id: string) {
        this.triggerReceiver!.trigger(id);
    }
}
