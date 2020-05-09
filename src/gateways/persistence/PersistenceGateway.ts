import { IUpdateChatPersistence, IChatPersistence, IInitChatPersistence } from "../../useCases";

export interface IPerrsistence {
    save: (key: string, value: string) => void;
}

export class PeristenceGateway implements IUpdateChatPersistence, IInitChatPersistence {
    constructor(private persistence: IPerrsistence) {}

    saveChatConfig(chatId: string, chat: IChatPersistence) {
        this.persistence.save(chatId, JSON.stringify(chat));
    }
}
