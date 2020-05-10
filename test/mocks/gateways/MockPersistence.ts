import { GateWay } from "../../../src/gateways/GateWay";
import { IUpdateChatPersistence, IInitChatPersistence, IStartAssistantPersistence } from "../../../src/useCases";

export class MockPersistence extends GateWay<{}>
    implements IStartAssistantPersistence, IUpdateChatPersistence, IInitChatPersistence {
    saveChatConfig = jest.fn();
    readAllChats = jest.fn();
}
