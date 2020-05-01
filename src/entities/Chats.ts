import { Chat } from "./Chat";

export class Chats {
    private static INSTANCE: Chats;
    private chats: Map<string, Chat>;

    private constructor() {
        this.chats = new Map();
    }

    public static get instance(): Chats {
        if (!Chats.INSTANCE) {
            Chats.INSTANCE = new Chats();
        }
        return Chats.INSTANCE;
    }

    public getChat(chatId: string) {
        let chat = this.chats.get(chatId);
        if (!chat) {
            chat = new Chat(chatId);
            this.chats.set(chatId, chat);
        }
        return chat;
    }
}
