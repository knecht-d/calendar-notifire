import { CronJob } from "cron";
import { AbstractTimer } from "./AbstractTimer";

export class CronTimer extends AbstractTimer {
    private triggers: { [id: string]: CronJob } = {};
    setTrigger(id: string, cron: string) {
        const job = new CronJob(cron, () => {
            if (this.triggerReceiver) {
                this.triggerReceiver.trigger(id);
            }
        });
        this.triggers[id] = job;
        job.start();
    }
    stopTrigger(id: string) {
        this.triggers[id].stop();
        delete this.triggers[id];
    }
}
