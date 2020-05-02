import { IUpdateTimer } from "../../useCases";
import { IRecurrenceRule, RecurrenceType } from "../../interfaces";

export interface ITriggerConfigure {
    setTrigger: (id: string, cron: string) => void;
}

export class TriggerGateway implements IUpdateTimer {
    constructor(private triggerConfig: ITriggerConfigure) {}

    public update(chatId: string, triggerId: string, recurrence: IRecurrenceRule) {
        const id = this.encodeId(chatId, triggerId);
        const cron = this.buildCron(recurrence);
        this.triggerConfig.setTrigger(id, cron);
    }
    private buildCron(recurrence: IRecurrenceRule) {
        const minute = `${recurrence.minute}`;
        const hour = (rec => {
            switch (rec.type) {
                case RecurrenceType.monthly:
                case RecurrenceType.daily:
                    return `${rec.hour}`;
                case RecurrenceType.hourly:
                    return `${rec.fromHour}-${rec.toHour}`;
            }
        })(recurrence);
        const dayMonth = (rec => {
            switch (rec.type) {
                case RecurrenceType.monthly:
                    return `${rec.day}`;
                case RecurrenceType.daily:
                case RecurrenceType.hourly:
                    return "*";
            }
        })(recurrence);
        const month = "*";
        const dayWeek = (rec => {
            switch (rec.type) {
                case RecurrenceType.daily:
                case RecurrenceType.hourly:
                    const days = [
                        rec.days.sunday ? "0" : "",
                        rec.days.monday ? "1" : "",
                        rec.days.tuesday ? "2" : "",
                        rec.days.wednesday ? "3" : "",
                        rec.days.thursday ? "4" : "",
                        rec.days.friday ? "5" : "",
                        rec.days.saturday ? "6" : "",
                    ]
                        .filter(value => !!value)
                        .join(",");
                    return days;
                case RecurrenceType.monthly:
                    return "*";
            }
        })(recurrence);
        return `${minute} ${hour} ${dayMonth} ${month} ${dayWeek}`;
    }

    private encodeId(chatId: string, triggerId: string) {
        return `${encodeURI(chatId)}|${encodeURI(triggerId)}`;
    }
    // private decodeId(id: string) {
    //     const parts = id.split("|");
    //     return {
    //         chatId: decodeURI(parts[0]),
    //         triggerId: decodeURI(parts[1]),
    //     }
    // }
}
