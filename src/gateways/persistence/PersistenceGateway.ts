import {
    IUpdateChatPersistence,
    IChatPersistence,
    IInitChatPersistence,
    IStartAssistantPersistence,
} from "../../useCases";
import { GateWay } from "../GateWay";

export interface IPerrsistence {
    save: (key: string, value: string) => void;
    readAll: () => { [key: string]: string };
}

interface IDependencies {
    persistence: IPerrsistence;
}

export class PeristenceGateway extends GateWay<IDependencies>
    implements IUpdateChatPersistence, IInitChatPersistence, IStartAssistantPersistence {
    readAllChats() {
        this.checkInitialized();
        const serializedData = this.dependencies!.persistence.readAll();
        const data = Object.entries(serializedData).reduce((result, [chatId, serializedString]) => {
            result[chatId] = JSON.parse(serializedString);
            return result;
        }, {} as { [chatId: string]: IChatPersistence });
        return data;
    }
    saveChatConfig(chatId: string, chat: IChatPersistence) {
        this.checkInitialized();
        this.dependencies!.persistence.save(chatId, JSON.stringify(chat));
    }
}
