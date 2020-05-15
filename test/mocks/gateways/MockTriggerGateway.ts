import { ITriggerReceiver } from "../../../src/gateways";
import { GateWay } from "../../../src/gateways/GateWay";
import { ITimerSetter, ITimerStopper } from "../../../src/useCases";

export class MockTriggerGateway extends GateWay<{}> implements ITimerStopper, ITriggerReceiver, ITimerSetter {
    set = jest.fn();
    trigger = jest.fn();
    stop = jest.fn();
}
