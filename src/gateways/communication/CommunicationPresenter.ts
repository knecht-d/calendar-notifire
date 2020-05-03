import { IUpdateCommunication } from "../../useCases";
import { CommunicationError } from "./CommunicationError";
import { Mappings } from "./Mappings";
import { IEventCommunication, IEvent } from "../../useCases/reminder/Reminder";

export interface ICommunicationOut {
    send: (chatId: string, message: string) => void;
}

export interface IErrorReporter {
    sendError: (chatId: string, message: string) => void;
    sendCommunicationError: (chatId: string, error: CommunicationError) => void;
}

export class CommunicationPresenter implements IUpdateCommunication, IEventCommunication, IErrorReporter {
    constructor(private communication: ICommunicationOut) {}
    sendEvents(chatId: string, events: IEvent[]) {
        this.communication.send(chatId, `Events: ${JSON.stringify(events, null, "  ")}`);
    }
    sendUpdateSuccess(chatId: string, triggerId: string, message?: string) {
        this.communication.send(chatId, `Update ${triggerId} erfolgreich.${message ? ` ${message}` : ""}`);
    }
    sendUpdateError(chatId: string, triggerId: string, message?: string) {
        this.sendError(chatId, `Update ${triggerId} fehlgeschlagen${message ? ` - ${message}` : "."}`);
    }
    sendCommunicationError(chatId: string, error: CommunicationError) {
        const message = Mappings.errorCodes[error.key]
            .replace(/{given}/gm, error.given)
            .replace(/{expected}/gm, error.expected)
            .replace(/{example}/gm, error.example || "");
        this.sendError(chatId, message);
    }
    sendError(chatId: string, message: string) {
        this.communication.send(chatId, `Fehler: ${message}`);
    }
}
