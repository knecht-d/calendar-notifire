import { ICommunication, IMessage, MessageKey } from "../../useCases";
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
                    text = `Konfiguration: ${JSON.stringify(message.timeFrames, null, "  ")}`;
                    break;
                case MessageKey.INITIALIZE_CHAT:
                    text = "Initialisierung des Chats erfolgreich.";
                    break;
                case MessageKey.EVENTS: {
                    const eventsText = message.events
                        .map(event => {
                            const startDate = event.start.toLocaleDateString("de-DE");
                            const startTime = event.start.toLocaleTimeString("de-DE", {
                                hour: "2-digit",
                                minute: "2-digit",
                            });
                            const endDate = event.end.toLocaleDateString("de-DE");
                            const endTime = event.end.toLocaleTimeString("de-DE", {
                                hour: "2-digit",
                                minute: "2-digit",
                            });
                            return `${event.title}:
    ${startDate} ${startTime} - ${`${startDate !== endDate ? `${endDate} ` : ""}${endTime}`}${event.description ||
                                ""}${event.location || ""}`.trim();
                        })
                        .join("\n\n");
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
}
