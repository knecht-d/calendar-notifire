import { AbstractTimer } from "./AbstractTimer";

export class TestSetIntervalTimer extends AbstractTimer {
    private triggers: { [id: string]: NodeJS.Timeout } = {};
    setTrigger(id: string, _cron: string) {
        const interval = setInterval(async () => {
            if (this.triggerReceiver) {
                await this.triggerReceiver.trigger(id);
            }
        }, 1000);
        this.triggers[id] = interval;
    }
    stopTrigger(id: string) {
        clearInterval(this.triggers[id]);
        delete this.triggers[id];
    }
}
