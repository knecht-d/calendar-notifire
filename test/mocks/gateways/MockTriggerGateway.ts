import { GateWay } from "../../../src/gateways/GateWay";
import { ISetTimer, IStartAssistantTimer, IDeleteConfigTimer } from "../../../src/useCases";
import { ITriggerReceiver } from "../../../src/gateways";

export class MockTriggerGateway extends GateWay<{}>
    implements ISetTimer, IDeleteConfigTimer, ITriggerReceiver, IStartAssistantTimer {
    set = jest.fn();
    trigger = jest.fn();
    stop = jest.fn();
}
