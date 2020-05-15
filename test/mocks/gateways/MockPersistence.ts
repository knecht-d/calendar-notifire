import { GateWay } from "../../../src/gateways/GateWay";
import { IChatConfigLoader, IChatConfigSaver } from "../../../src/useCases";

export class MockPersistence extends GateWay<{}> implements IChatConfigSaver, IChatConfigLoader {
    saveChatConfig = jest.fn();
    readAllChats = jest.fn();
}
