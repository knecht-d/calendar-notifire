import { Chat } from "./Chat";

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

    public getChat(chatId: string) {
        if (!this.chats[chatId]) {
            this.chats[chatId] = new Chat();
        }
        return this.chats[chatId];
    }

    public toJSON() {
        return {
            chats: this.chats,
        };
    }
}
