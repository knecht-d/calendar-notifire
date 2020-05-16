import { AbstractChat } from "../../../src/external";

/* istanbul ignore file */
export class MockChat extends AbstractChat<{}> {
    public send = jest.fn();
    public start = jest.fn();

    constructor(setupData: {}) {
        super(setupData);
    }

    public fireSet(chatId: string, userId: string, payload: string) {
        this.communication!.set(chatId, userId, payload);
    }
    public fireInitChat(chatId: string, userId: string) {
        this.communication!.initChat(chatId, userId);
    }
    public fireDelete(chatId: string, userId: string, payload: string) {
        this.communication!.delete(chatId, userId, payload);
    }
    public fireRead(chatId: string) {
        this.communication!.read(chatId);
    }
    public fireAddAdmin(chatId: string, userId: string, payload: string) {
        this.communication!.addAdmin(chatId, userId, payload);
    }
    public fireRemoveAdmin(chatId: string, userId: string, payload: string) {
        this.communication!.removeAdmin(chatId, userId, payload);
    }
}
