import { AbstractChat, ILogger } from "../../../src/external";
import { IGenericConfig } from "../../../src/gateways";

/* istanbul ignore file */
export class MockChat extends AbstractChat<{}> {
    public send = jest.fn();
    public start = jest.fn();

    constructor(logger: ILogger, setupData: {}) {
        super(logger, setupData);
    }

    public async fireSet(chatId: string, userId: string, triggerId: string, config: IGenericConfig) {
        await this.communication!.set(chatId, userId, triggerId, config);
    }
    public async fireInitChat(chatId: string, userId: string) {
        await this.communication!.initChat(chatId, userId);
    }
    public async fireDelete(chatId: string, userId: string, payload: string) {
        await this.communication!.delete(chatId, userId, payload);
    }
    public async fireRead(chatId: string) {
        await this.communication!.read(chatId);
    }
    public async fireAddAdmin(chatId: string, userId: string, payload: string) {
        await this.communication!.addAdmin(chatId, userId, payload);
    }
    public async fireRemoveAdmin(chatId: string, userId: string, payload: string) {
        await this.communication!.removeAdmin(chatId, userId, payload);
    }
}
