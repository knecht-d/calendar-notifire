import {
    IUpdateCommunication,
    IInitCommunication,
    IDeleteConfigCommunication,
    IReadConfigCommunication,
    ITriggers,
} from "../../useCases";
import { CommunicationError } from "./CommunicationError";
import { Mappings } from "./Mappings";
import { IEventCommunication, IEvent } from "../../useCases/reminder/Reminder";
import { GateWay } from "../GateWay";

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

export class CommunicationPresenter extends GateWay<IDependencies>
    implements
        IUpdateCommunication,
        IInitCommunication,
        IEventCommunication,
        IErrorReporter,
        IDeleteConfigCommunication,
        IReadConfigCommunication {
    sendEvents(chatId: string, events: IEvent[]) {
        this.send(chatId, `Events: ${JSON.stringify(events, null, "  ")}`);
    }
    sendReadConfig(chatId: string, triggers: ITriggers) {
        this.send(chatId, JSON.stringify(triggers, null, "  "));
    }

    sendDeleteConfigSuccess(chatId: string, triggerId: string, message?: string) {
        this.send(chatId, `Löschen von ${triggerId} erfolgreich.${message ? ` ${message}` : ""}`);
    }
    sendDeleteConfigError(chatId: string, triggerId: string, message?: string) {
        this.sendError(chatId, `Löschen von ${triggerId} fehlgeschlagen${message ? ` - ${message}` : "."}`);
    }

    sendUpdateSuccess(chatId: string, triggerId: string, message?: string) {
        this.send(chatId, `Update ${triggerId} erfolgreich.${message ? ` ${message}` : ""}`);
    }
    sendUpdateError(chatId: string, triggerId: string, message?: string) {
        this.sendError(chatId, `Update ${triggerId} fehlgeschlagen${message ? ` - ${message}` : "."}`);
    }

    sendInitSuccess(chatId: string, message?: string) {
        this.send(chatId, `Erzeugen des Chats erfolgreich.${message ? ` ${message}` : ""}`);
    }
    sendInitError(chatId: string, message?: string) {
        this.sendError(chatId, `Erzeugen des Chats fehlgeschlagen${message ? ` - ${message}` : "."}`);
    }

    sendCommunicationError(chatId: string, error: CommunicationError) {
        const message = Mappings.errorCodes[error.key]
            .replace(/{given}/gm, error.given)
            .replace(/{expected}/gm, error.expected)
            .replace(/{example}/gm, error.example || "");
        this.sendError(chatId, message);
    }

    sendError(chatId: string, message: string) {
        this.send(chatId, `Fehler: ${message}`);
    }

    private send(chatId: string, message: string) {
        this.checkInitialized();
        this.dependencies!.communication.send(chatId, message);
    }
}
