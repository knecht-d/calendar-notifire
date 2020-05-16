import { AbstractTimer } from "../../../src/external";

export class MockTimer extends AbstractTimer {
    public triggers: { [key: string]: string } = {};
    setTrigger = jest.fn((id: string, cron: string) => {
        this.triggers[id] = cron;
    });
    stopTrigger = jest.fn((id: string) => {
        delete this.triggers[id];
    });

    async fireTrigger(id: string) {
        await this.triggerReceiver!.trigger(id);
    }
}
