declare module "ical-expander" {
    export class IcalExpander {
        constructor(opts: ConstructorOptions);
        between(after?: Date, before?: Date): Result;
        before(before: Date): Result;
        after(after: Date): Result;
        all(): Result;
    }

    export default IcalExpander;

    export type ConstructorOptions = {
        ics?: string;
        maxIterations?: number;
    };
    export type Result = {
        events: Event[];
        occurrences: occurrenceDetails[];
    };

    export type occurrenceDetails = {
        recurrenceId: Time;
        item: Event;
        startDate: Time;
        endDate: Time;
    };

    // From: https://github.com/etesync/etesync-web/blob/master/src/types/ical.js.d.ts
    export class Component {
        public static fromString(str: string): Component;

        public name: string;

        constructor(jCal: any[] | string, parent?: Component);

        public toJSON(): any[];

        public getFirstSubcomponent(name?: string): Component | null;
        public getAllSubcomponents(name?: string): Component[];

        public getFirstPropertyValue(name?: string): any;

        public getFirstProperty(name?: string): Property;
        public getAllProperties(name?: string): Property[];

        public addProperty(property: Property): Property;
        public addPropertyWithValue(name: string, value: string | number | object): Property;

        public updatePropertyWithValue(name: string, value: string | number | object): Property;

        public removeAllProperties(name?: string): boolean;

        public addSubcomponent(component: Component): Component;
    }

    export class Event {
        public uid: string;
        public summary: string;
        public startDate: Time;
        public endDate: Time;
        public description: string;
        public location: string;
        public attendees: Property[];

        public component: Component;

        public constructor(
            component?: Component | null,
            options?: {
                strictExceptions: boolean;
                exepctions: Array<Component | Event>;
            },
        );

        public isRecurring(): boolean;
        public iterator(startTime?: Time): RecurExpansion;
    }

    export class Property {
        public name: string;
        public type: string;

        constructor(jCal: any[] | string, parent?: Component);

        public getFirstValue(): any;
        public getValues(): any[];

        public setParameter(name: string, value: string | string[]): void;
        public setValue(value: string | object): void;
        public toJSON(): any;
    }

    export interface TimeJsonData {
        year?: number;
        month?: number;
        day?: number;
        hour?: number;
        minute?: number;
        second?: number;
        isDate?: boolean;
    }

    export class Time {
        public static fromString(str: string): Time;
        public static fromJSDate(aDate: Date | null, useUTC: boolean): Time;
        public static fromData(aData: TimeJsonData): Time;

        public static now(): Time;

        public isDate: boolean;
        public timezone: string;
        public zone: Timezone;

        constructor(data?: TimeJsonData);
        public compare(aOther: Time): number;

        public clone(): Time;

        public adjust(
            aExtraDays: number,
            aExtraHours: number,
            aExtraMinutes: number,
            aExtraSeconds: number,
            aTimeopt?: Time,
        ): void;

        public addDuration(aDuration: Duration): void;
        public subtractDateTz(aDate: Time): Duration;

        public toJSDate(): Date;
        public toJSON(): TimeJsonData;
    }

    export class Duration {
        public days: number;
    }

    export class RecurExpansion {
        public complete: boolean;

        public next(): Time;
    }

    export class Timezone {
        public static localTimezone: Timezone;
        public static convert_time(tt: Time, fromZone: Timezone, toZone: Timezone): Time;

        public tzid: string;
    }
}
