import { AbstractTimer } from "./AbstractTimer";

export class TestSetIntervalTimer extends AbstractTimer {
    private triggers: { [id: string]: NodeJS.Timeout } = {};
    setTrigger(id: string, cron: string) {
        const interval = setInterval(() => {
            console.log("Trigger:", id, cron);
            if (this.triggerReceiver) {
                this.triggerReceiver.trigger(id);
            }
        }, 1000);
        this.triggers[id] = interval;
    }
    stopTrigger(id: string) {
        clearInterval(this.triggers[id]);
        delete this.triggers[id];
    }
}
