import {
    ICommunication,
    IDaysOfWeekConfig,
    IEvent,
    IMessage,
    IPersistedRecurrenceRule,
    ISerializedTimeFrame,
    ITriggers,
    MessageKey,
    PersistedRecurrenceType,
} from "../../useCases";
import { GateWay } from "../GateWay";
import { logCall } from "../logging";
import { CommunicationError, CommunicationErrorCode } from "./CommunicationError";

export interface ICommunicationOut {
    send: (chatId: string, message: string) => void;
}

export interface IErrorReporter {
    sendError: (chatId: string, message: string) => void;
    sendCommunicationError: (chatId: string, error: CommunicationError) => void;
}

interface IDependencies {
    communication: ICommunicationOut;
}

export class CommunicationPresenter extends GateWay<IDependencies> implements IErrorReporter, ICommunication {
    sendCommunicationError(chatId: string, error: CommunicationError) {
        let text = "";
        switch (error.key) {
            case CommunicationErrorCode.MISSING_TRIGGER_ID:
                text = "Trigger ID Fehlt";
                break;
            case CommunicationErrorCode.INVALID_RECURRENCE_TYPE:
                text = `Falscher Typ für Wiederholungen [${error.given}]. Mögliche Werte: ${error.expected}`;
                break;
            case CommunicationErrorCode.INVALID_NUMBER_OF_ARGUMENTS:
                text = `Falsche Anzahl an Argumenten [${error.given}]. Beispiel: {example}`;
                break;
            case CommunicationErrorCode.INVALID_DAYS:
                text = `Falsche Eingabe für Wochentage [${error.given}]. Mögliche Werte: ${error.expected}`;
                break;
            case CommunicationErrorCode.INVALID_DAY_OF_MONTH:
                text = `Falsche Eingabe für Tag des Monats [${error.given}]. Mögliche Werte: ${error.expected}`;
                break;
            case CommunicationErrorCode.INVALID_TIME:
                text = `Falsche Zeitangabe [${error.given}]. Mögliche Werte: ${error.expected}`;
                break;
            case CommunicationErrorCode.INVALID_FRAME_CONFIG:
                text = `Falsche Eingabe für den Betrachtungszeitraum [${error.given}]. Beispiel: ${error.example}`;
                break;
        }

        this.sendError(chatId, text);
    }

    @logCall()
    sendError(chatId: string, message: string) {
        this.dependencies!.communication.send(chatId, `Fehler: ${message}`);
    }

    @logCall({ level: "verbose" })
    send(chatId: string, message: IMessage) {
        this.checkInitialized();
        const text = this.getText(message);
        this.dependencies!.communication.send(chatId, text);
    }

    private getText(message: IMessage): string {
        let text = "";
        if (message.hasError) {
            switch (message.key) {
                case MessageKey.SET_CONFIG:
                    text = `Setzen von ${message.triggerId} fehlgeschlagen.`;
                    break;
                case MessageKey.DELETE_CONFIG:
                    text = `Löschen von ${message.triggerId} fehlgeschlagen.`;
                    break;
                case MessageKey.READ_CONFIG:
                    text = "Lesen der Konfiguration fehlgeschlagen.";
                    break;
                case MessageKey.INITIALIZE_CHAT:
                    text = "Initialisierung des Chats fehlgeschlagen.";
                    break;
                case MessageKey.EVENTS: {
                    text = "Lesen der Termine fehlgeschlagen";
                    break;
                }
                case MessageKey.ADD_ADMIN:
                    text = `Hinzufügen von ${message.newAdmin} zu Administratoren fehlgeschlagen.`;
                    break;
                case MessageKey.REMOVE_ADMIN:
                    text = `Entfernen von ${message.oldAdmin} aus Administratoren fehlgeschlagen.`;
                    break;
            }
        } else {
            switch (message.key) {
                case MessageKey.SET_CONFIG:
                    text = `Setzen von ${message.triggerId} erfolgreich.`;
                    break;
                case MessageKey.DELETE_CONFIG:
                    text = `Löschen von ${message.triggerId} erfolgreich.`;
                    break;
                case MessageKey.READ_CONFIG:
                    text = `${this.getConfigText(message.triggers)}`;
                    break;
                case MessageKey.INITIALIZE_CHAT:
                    text = "Initialisierung des Chats erfolgreich.";
                    break;
                case MessageKey.EVENTS: {
                    const eventsText = message.events
                        .map(event => this.getEventText(event))
                        .join("\n\n")
                        .trim();
                    text = `Termine:\n${eventsText}`;
                    break;
                }
                case MessageKey.ADD_ADMIN:
                    text = `${message.newAdmin} erfolgreich zu Administratoren hinzugefügt.`;
                    break;
                case MessageKey.REMOVE_ADMIN:
                    text = `${message.oldAdmin} erfolgreich von Administratoren entfernt.`;
                    break;
            }
        }
        return `${text}${message.message ? ` ${message.message}` : ""}`;
    }

    private getDateTimeString(date: Date) {
        const dateString = date.toLocaleDateString("de-DE");
        const timeString = date.toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
        });
        return { date: dateString, time: timeString };
    }

    private getEventText(event: IEvent): string {
        const { date: startDate, time: startTime } = this.getDateTimeString(event.start);
        const { date: endDate, time: endTime } = this.getDateTimeString(event.end);
        return `
${event.title}:
    ${startDate} ${startTime} - ${`${startDate !== endDate ? `${endDate} ` : ""}${endTime}`}
    ${event.description || ""}${event.location || ""}`;
    }

    private getConfigText(triggers: ITriggers) {
        return Object.entries(triggers)
            .map(([key, settings]) =>
                `${key}:\n    ${this.getRecurrenceText(settings.recurrence)}\n    ${this.getTriggerExample(
                    settings,
                )}`.trim(),
            )
            .join("\n\n");
    }

    private getTriggerExample(trigger: ISerializedTimeFrame) {
        if (!trigger.next) {
            return "";
        }
        const { date, time } = this.getDateTimeString(trigger.next);
        const example = `Nächte Erinnerung am ${date} um ${time}`;
        if (!trigger.nextEventsFrom || !trigger.nextEventsTo) {
            return example;
        }
        const { date: fromDate, time: fromTime } = this.getDateTimeString(trigger.nextEventsFrom);
        const { date: toDate, time: toTime } = this.getDateTimeString(trigger.nextEventsTo);
        return `${example} zeigt Termine von ${fromDate} ${fromTime} bis ${`${
            fromDate !== toDate ? `${toDate} ` : ""
        }${toTime}`}`;
    }

    private getRecurrenceText(recurrence: IPersistedRecurrenceRule): string {
        const pad = (value: number) => `${value}`.padStart(2, "0");
        switch (recurrence.type) {
            case PersistedRecurrenceType.hourly:
                return `Stündlich von ${pad(recurrence.fromHour)}:${pad(recurrence.minute)} bis ${pad(
                    recurrence.toHour,
                )}:${pad(recurrence.minute)} ${this.getDaysOfWeekText(recurrence.days)}`;
            case PersistedRecurrenceType.daily:
                return `Einmal täglich um ${pad(recurrence.hour)}:${pad(recurrence.minute)} ${this.getDaysOfWeekText(
                    recurrence.days,
                )}`;
            case PersistedRecurrenceType.monthly:
                return `Jeden Monat am ${recurrence.day}. um ${pad(recurrence.hour)}:${pad(recurrence.minute)}`;
        }
    }

    private getDaysOfWeekText(config: IDaysOfWeekConfig): string {
        function matches(configA: IDaysOfWeekConfig, configB: IDaysOfWeekConfig) {
            return (
                !!configA.monday === !!configB.monday &&
                !!configA.tuesday === !!configB.tuesday &&
                !!configA.wednesday === !!configB.wednesday &&
                !!configA.thursday === !!configB.thursday &&
                !!configA.friday === !!configB.friday &&
                !!configA.saturday === !!configB.saturday &&
                !!configA.sunday === !!configB.sunday
            );
        }
        const weekDays: IDaysOfWeekConfig = {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
        };
        const weekEnd: IDaysOfWeekConfig = {
            saturday: true,
            sunday: true,
        };
        const all: IDaysOfWeekConfig = {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true,
        };

        if (matches(config, weekDays)) {
            return "an allen Wochentagen";
        }
        if (matches(config, weekEnd)) {
            return "am Wochenende";
        }
        if (matches(config, all)) {
            return "an allen Tagen";
        }
        const days = [
            ...(config.monday ? ["Montag"] : []),
            ...(config.tuesday ? ["Dienstag"] : []),
            ...(config.wednesday ? ["Mittwoch"] : []),
            ...(config.thursday ? ["Donnerstag"] : []),
            ...(config.friday ? ["Freitag"] : []),
            ...(config.saturday ? ["Samstag"] : []),
            ...(config.sunday ? ["Sonntag"] : []),
        ];
        const lastDay = days.pop()!;
        return `am ${days.length > 0 ? `${days.join(", ")} und ` : ""}${lastDay}`;
    }
}
