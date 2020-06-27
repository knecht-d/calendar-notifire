import { AbstractTimer } from "./AbstractTimer";

export class TestSetIntervalTimer extends AbstractTimer {
    private triggers: { [id: string]: NodeJS.Timeout } = {};
    getNextExecution(_id: string): Date {
        return new Date();
    }
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
