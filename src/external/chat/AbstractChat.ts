import { ICommunicationOut, ICommunicationIn } from "../../gateways";

export abstract class AbstractChat<ChatSetup> implements ICommunicationOut {
    protected communication?: ICommunicationIn;
    constructor(protected setupData: ChatSetup) {}

    public init(communication: ICommunicationIn) {
        this.communication = communication;
    }

    abstract send(chatId: string, message: string): void;
    abstract start(): void;
}
