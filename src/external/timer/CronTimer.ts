import { CronJob } from "cron";
import { logCall } from "../logging";
import { AbstractTimer } from "./AbstractTimer";

export class CronTimer extends AbstractTimer {
    private triggers: { [id: string]: { job: CronJob; cron: string } } = {};

    @logCall()
    getNextExecution(id: string): Date {
        return this.triggers[id].job.nextDate().toDate();
    }

    @logCall()
    setTrigger(id: string, cron: string) {
        if (this.triggers[id]) {
            this.triggers[id].job.stop();
        }
        const job = new CronJob(cron, async () => {
            if (this.triggerReceiver) {
                await this.triggerReceiver.trigger(id);
            }
        });
        this.triggers[id] = { job, cron };
        job.start();
        this.logCurrentTriggers();
    }

    @logCall()
    stopTrigger(id: string) {
        this.triggers[id].job.stop();
        delete this.triggers[id];
        this.logCurrentTriggers();
    }

    private logCurrentTriggers() {
        const printableTriggerInfo = Object.entries(this.triggers).map(([key, settings]) => [key, settings.cron]);
        this.logger.info("CronTimer", `Current triggers: ${printableTriggerInfo}`);
    }
}
