/* istanbul ignore file */
import { CronJob } from "cron";

console.info("Before job instantiation");
const job = new CronJob("*/5 * * * * *", function() {
    const d = new Date();
    console.info("First:", d);
});

const job2 = new CronJob("*/8 * * * * *", function() {
    const d = new Date();
    console.info("Second:", d);
});
console.info("After job instantiation");
console.info("Start", new Date());
job.start();
job2.start();
