import { ICommunication, IMessage, MessageKey } from "../../useCases";
import { GateWay } from "../GateWay";
import { CommunicationError } from "./CommunicationError";
import { Mappings } from "./Mappings";

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
        const message = this.replacePlaceHolders(Mappings.errorCodes[error.key], {
            given: error.given,
            expected: error.expected,
            example: error.example || "",
        });
        this.sendError(chatId, message);
    }

    sendError(chatId: string, message: string) {
        this.dependencies!.communication.send(chatId, `Fehler: ${message}`);
    }

    send(chatId: string, message: IMessage) {
        this.checkInitialized();
        const text = this.getText(message);
        this.dependencies!.communication.send(chatId, text);
    }

    private getText(message: IMessage): string {
        const mapping = message.hasError ? Mappings.errorMessages : Mappings.successMessages;
        let replacements: { [key: string]: string } = {};
        switch (message.key) {
            case MessageKey.SET_CONFIG:
            case MessageKey.DELETE_CONFIG:
                replacements = { triggerId: message.triggerId };
                break;
            case MessageKey.READ_CONFIG:
                replacements = { timeFrames: JSON.stringify(message.timeFrames, null, "  ") };
                break;
            case MessageKey.INITIALIZE_CHAT:
                replacements = {};
                break;
            case MessageKey.EVENTS:
                replacements = { events: JSON.stringify(message.events, null, "  ") };
                break;
        }
        replacements = {
            message: message.message ? ` ${message.message}` : "",
            ...replacements,
        };
        return this.replacePlaceHolders(mapping[message.key], replacements);
    }

    private replacePlaceHolders(message: string, replacements: { [key: string]: string }) {
        let newMessage = message;
        Object.entries(replacements).forEach(([key, value]) => {
            newMessage = newMessage.replace(new RegExp(`{${key}}`, "gm"), value);
        });
        return newMessage;
    }
}
