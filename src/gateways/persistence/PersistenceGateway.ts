import { IUpdateChatPersistence, IChatPersistence, IInitChatPersistence } from "../../useCases";
import { GateWay } from "../GateWay";

export interface IPerrsistence {
    save: (key: string, value: string) => void;
}

interface IDependencies {
    persistence: IPerrsistence;
}

export class PeristenceGateway extends GateWay<IDependencies> implements IUpdateChatPersistence, IInitChatPersistence {
    saveChatConfig(chatId: string, chat: IChatPersistence) {
        this.checkInitialized();
        this.dependencies!.persistence.save(chatId, JSON.stringify(chat));
    }
}
