/* istanbul ignore file */
import { readFileSync } from "fs";
import IcalExpander from "ical-expander";

const ics = readFileSync(__dirname + "/../assets/Example2.ics").toString();

const icalExpander = new IcalExpander({ ics, maxIterations: 100 });
const events = icalExpander.between(new Date("2020-04-01T00:00:00.000Z"), new Date("2020-05-30T00:00:00.000Z"));

const mappedEvents = events.events.map(e => ({ startDate: e.startDate.toJSDate(), summary: e.summary }));
const mappedOccurrences = events.occurrences.map(o => ({ startDate: o.startDate.toJSDate(), summary: o.item.summary }));
const allEvents = ([] as Array<{ startDate: Date; summary: string }>)
    .concat(mappedEvents, mappedOccurrences)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

console.info(allEvents.map(e => `${e.startDate.toLocaleString()} - ${e.summary}`).join("\n"));
