import { GateWay } from "../../../src/gateways/GateWay";
import { IUpdateTimer, IStartAssistantTimer, IDeleteConfigTimer } from "../../../src/useCases";
import { ITriggerReceiver } from "../../../src/gateways";

export class MockTriggerGateway extends GateWay<{}>
    implements IUpdateTimer, IDeleteConfigTimer, ITriggerReceiver, IStartAssistantTimer {
    set = jest.fn();
    update = jest.fn();
    trigger = jest.fn();
    stop = jest.fn();
}
