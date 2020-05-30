import { ICommunicationIn, ICommunicationOut } from "../../gateways";
import { External } from "../External";
import { ILogger } from "../logging";

export abstract class AbstractChat<ChatSetup> extends External implements ICommunicationOut {
    protected communication?: ICommunicationIn;
    constructor(logger: ILogger, protected setupData: ChatSetup) {
        super(logger);
    }

    public init(communication: ICommunicationIn) {
        this.communication = communication;
    }

    abstract send(chatId: string, message: string): Promise<void>;
    abstract start(): Promise<void>;
}
