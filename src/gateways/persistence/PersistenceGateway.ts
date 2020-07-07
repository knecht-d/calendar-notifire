import { IChatConfigLoader, IChatConfigSaver, ISerializedChat } from "../../useCases";
import { GateWay } from "../GateWay";
import { logCall, logTime } from "../logging";

export interface IPerrsistence {
    save: (key: string, value: string) => void;
    readAll: () => { [key: string]: string };
}

interface IDependencies {
    persistence: IPerrsistence;
}

export class PeristenceGateway extends GateWay<IDependencies> implements IChatConfigSaver, IChatConfigLoader {
    @logCall()
    @logTime()
    readAllChats() {
        this.checkInitialized();
        const serializedData = this.dependencies!.persistence.readAll();
        const data = Object.entries(serializedData).reduce((result, [chatId, serializedString]) => {
            result[chatId] = JSON.parse(serializedString);
            return result;
        }, {} as { [chatId: string]: ISerializedChat });
        return data;
    }
    @logCall()
    @logTime()
    saveChatConfig(chatId: string, chat: ISerializedChat) {
        this.checkInitialized();
        this.dependencies!.persistence.save(chatId, JSON.stringify(chat));
    }
}
