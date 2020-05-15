import { ITimeFrameSettings, MessageKey, PersistedRecurrenceType } from "../../useCases";
import { CommunicationErrorCode } from "./CommunicationError";

type Days = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
interface IMappings {
    recurrence: { [key: string]: PersistedRecurrenceType | undefined };
    timeFrames: { [key: string]: keyof ITimeFrameSettings };
    days: { [key in Days]: string };
    errorCodes: { [key in CommunicationErrorCode]: string };
    successMessages: { [key in MessageKey]: string };
    errorMessages: { [key in MessageKey]: string };
}

export const Mappings: IMappings = {
    recurrence: {
        s: "h" as PersistedRecurrenceType,
        t: "d" as PersistedRecurrenceType,
        m: "m" as PersistedRecurrenceType,
    },
    timeFrames: {
        j: "year",
        M: "month",
        t: "day",
        s: "hour",
        m: "minute",
    },
    days: {
        monday: "mo",
        tuesday: "di",
        wednesday: "mi",
        thursday: "do",
        friday: "fr",
        saturday: "sa",
        sunday: "so",
    },
    errorCodes: {
        MISSING_TRIGGER_ID: "Trigger ID Fehlt",
        INVALID_RECURRENCE_TYPE: "Falscher Typ für Wiederholungen [{given}]. Mögliche Werte: {expected}",
        INVALID_NUMBER_OF_ARGUMENTS: "Falsche Anzahl an Argumenten [{given}]. Beispiel: {example}",
        INVALID_DAYS: "Falsche Eingabe für Wochentage [{given}]. Mögliche Werte: {expected}",
        INVALID_DAY_OF_MONTH: "Falsche Eingabe für Tag des Monats [{given}]. Mögliche Werte: {expected}",
        INVALID_TIME: "Falsche Zeitangabe [{given}]. Mögliche Werte: {expected}",
        INVALID_FRAME_CONFIG: "Falsche Eingabe für den Betrachtungszeitraum [{given}]. Beispiel: {example}",
    },
    successMessages: {
        SET_CONFIG: "Setzen von {triggerId} erfolgreich.{message}",
        DELETE_CONFIG: "Löschen von {triggerId} erfolgreich.{message}",
        READ_CONFIG: "Konfiguration: {timeFrames}{message}",
        INITIALIZE_CHAT: "Initialisierung des Chats erfolgreich.{message}",
        EVENTS: "Termine: {events}{message}",
    },
    errorMessages: {
        SET_CONFIG: "Setzen von {triggerId} fehlgeschlagen.{message}",
        DELETE_CONFIG: "Löschen von {triggerId} fehlgeschlagen.{message}",
        READ_CONFIG: "Lesen der Konfiguration fehlgeschlagen.{message}",
        INITIALIZE_CHAT: "Initialisierung des Chats fehlgeschlagen.{message}",
        EVENTS: "Lesen der Termine fehlgeschlagen.{message}",
    },
};
