import { AbstractTimer } from "./AbstractTimer";

export class TestSetIntervalTimer extends AbstractTimer {
    setTrigger(id: string, cron: string) {
        setInterval(() => {
            console.log("Trigger:", id, cron);
            if (this.triggerReceiver) {
                this.triggerReceiver.trigger(id);
            }
        }, 1000);
    }
}
