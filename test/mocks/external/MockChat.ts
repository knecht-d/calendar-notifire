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
}
