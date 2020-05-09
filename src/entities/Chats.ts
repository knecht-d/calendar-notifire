import { Chat } from "./Chat";
import { EntityError, EntityErrorCode } from "./EntityError";

export class Chats {
    private static INSTANCE: Chats;
    private chats: { [chatId: string]: Chat };

    private constructor() {
        this.chats = {};
    }

    public static get instance(): Chats {
        if (!Chats.INSTANCE) {
            Chats.INSTANCE = new Chats();
        }
        return Chats.INSTANCE;
    }

    public createChat(chatId: string, adminId: string) {
        if (this.chats[chatId]) {
            throw new EntityError(EntityErrorCode.CHAT_ALREADY_EXISTING);
        }
        const chat = new Chat(adminId);
        this.chats[chatId] = chat;
        return chat;
    }

    public getChat(chatId: string) {
        if (!this.chats[chatId]) {
            throw new EntityError(EntityErrorCode.CHAT_NOT_EXISTING);
        }
        return this.chats[chatId];
    }

    public toJSON() {
        return {
            chats: this.chats,
        };
    }
}
