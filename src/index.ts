/* istanbul ignore file */
import { readFileSync } from "fs";
import * as ICAL from "ical.js";

try {
    const data = readFileSync(__dirname + "/../assets/Example2.ics").toString();
    console.info(data);
    const jCalData = ICAL.parse(data);
    const comp = new ICAL.Component(jCalData);

    // Fetch the VEVENT part
    const vevents = comp.getAllSubcomponents("vevent");
    const events = vevents.map(e => new ICAL.Event(e));

    events.forEach(e => {
        if (e.isRecurring()) {
            const iterator = e.iterator();
            let next = iterator.next();
            while (next) {
                const n = e.getOccurrenceDetails(next);
                console.info(e.summary, n.startDate.toJSDate(), (e as any).recurrenceId);
                next = iterator.next();
            }
        } else {
            console.info(e.summary, e.startDate.toJSDate(), (e as any).recurrenceId);
        }
    });
} catch (err) {
    console.error(err);
}
