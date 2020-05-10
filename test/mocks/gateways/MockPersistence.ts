import { GateWay } from "../../../src/gateways/GateWay";
import {
    IUpdateChatPersistence,
    IInitChatPersistence,
    IStartAssistantPersistence,
    IDeleteConfigChatPersistence,
} from "../../../src/useCases";

export class MockPersistence extends GateWay<{}>
    implements IStartAssistantPersistence, IDeleteConfigChatPersistence, IUpdateChatPersistence, IInitChatPersistence {
    saveChatConfig = jest.fn();
    readAllChats = jest.fn();
}
