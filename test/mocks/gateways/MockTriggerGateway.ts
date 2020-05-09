import { GateWay } from "../../../src/gateways/GateWay";
import { IUpdateTimer } from "../../../src/useCases";
import { ITriggerReceiver } from "../../../src/gateways";

export class MockTriggerGateway extends GateWay<{}> implements IUpdateTimer, ITriggerReceiver {
    update = jest.fn();
    trigger = jest.fn();
}
