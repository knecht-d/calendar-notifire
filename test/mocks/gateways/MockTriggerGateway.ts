import { GateWay } from "../../../src/gateways/GateWay";
import { IUpdateTimer, IStartAssistantTimer } from "../../../src/useCases";
import { ITriggerReceiver } from "../../../src/gateways";

export class MockTriggerGateway extends GateWay<{}> implements IUpdateTimer, ITriggerReceiver, IStartAssistantTimer {
    set = jest.fn();
    update = jest.fn();
    trigger = jest.fn();
}
