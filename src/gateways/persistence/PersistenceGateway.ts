import { IUpdateChatPersistence, IChatPersistence } from "../../useCases";

export interface IPerrsistence {
    save: (key: string, value: string) => void;
}

export class PeristenceGateway implements IUpdateChatPersistence {
    constructor(private persistence: IPerrsistence) {}

    saveUpdatedConfig(chatId: string, chat: IChatPersistence) {
        this.persistence.save(chatId, JSON.stringify(chat));
    }
}
