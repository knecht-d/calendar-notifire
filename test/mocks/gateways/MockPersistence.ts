import { GateWay } from "../../../src/gateways/GateWay";
import { IUpdateChatPersistence, IInitChatPersistence } from "../../../src/useCases";

export class MockPersistence extends GateWay<{}> implements IUpdateChatPersistence, IInitChatPersistence {
    saveChatConfig = jest.fn();
}
