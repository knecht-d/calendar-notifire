import {
    IPersistedRecurrenceRule,
    ITimerRead,
    ITimerSetter,
    ITimerStopper,
    PersistedRecurrenceType,
    Reminder,
} from "../../useCases";
import { GateWay } from "../GateWay";
import { logCall } from "../logging";

export interface ITriggerConfigure {
    setTrigger: (id: string, cron: string) => void;
    stopTrigger: (id: string) => void;
    getNextExecution: (id: string) => Date;
}

export interface ITriggerReceiver {
    trigger: (id: string) => Promise<void>;
}

interface IDependencies {
    triggerConfig: ITriggerConfigure;
    reminder: Reminder;
}

export class TriggerGateway extends GateWay<IDependencies>
    implements ITimerStopper, ITriggerReceiver, ITimerSetter, ITimerRead {
    async trigger(id: string) {
        this.checkInitialized();
        const { chatId, triggerId } = this.decodeId(id);
        await this.dependencies!.reminder.execute({ chatId, triggerId });
    }

    @logCall()
    public getNext(chatId: string, triggerId: string) {
        const id = this.encodeId(chatId, triggerId);
        return this.dependencies!.triggerConfig.getNextExecution(id);
    }

    @logCall()
    public stop(chatId: string, triggerId: string) {
        const id = this.encodeId(chatId, triggerId);
        this.dependencies!.triggerConfig.stopTrigger(id);
    }

    @logCall()
    public set(chatId: string, triggerId: string, recurrence: IPersistedRecurrenceRule) {
        const id = this.encodeId(chatId, triggerId);
        const cron = this.buildCron(recurrence);
        this.dependencies!.triggerConfig.setTrigger(id, cron);
    }

    private buildCron(recurrence: IPersistedRecurrenceRule) {
        const minute = `${recurrence.minute}`;
        const hour = (rec => {
            switch (rec.type) {
                case PersistedRecurrenceType.monthly:
                case PersistedRecurrenceType.daily:
                    return `${rec.hour}`;
                case PersistedRecurrenceType.hourly:
                    return `${rec.fromHour}-${rec.toHour}`;
            }
        })(recurrence);
        const dayMonth = (rec => {
            switch (rec.type) {
                case PersistedRecurrenceType.monthly:
                    return `${rec.day}`;
                case PersistedRecurrenceType.daily:
                case PersistedRecurrenceType.hourly:
                    return "*";
            }
        })(recurrence);
        const month = "*";
        const dayWeek = (rec => {
            switch (rec.type) {
                case PersistedRecurrenceType.daily:
                case PersistedRecurrenceType.hourly: {
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
                }
                case PersistedRecurrenceType.monthly:
                    return "*";
            }
        })(recurrence);
        return `${minute} ${hour} ${dayMonth} ${month} ${dayWeek}`;
    }

    private encodeId(chatId: string, triggerId: string) {
        return `${encodeURI(chatId)}|${encodeURI(triggerId)}`;
    }
    private decodeId(id: string) {
        const parts = id.split("|");
        return {
            chatId: decodeURI(parts[0]),
            triggerId: decodeURI(parts[1]),
        };
    }
}
