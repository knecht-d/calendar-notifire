import { ITriggerReceiver } from "../../../src/gateways";
import { GateWay } from "../../../src/gateways/GateWay";
import { ITimerRead, ITimerSetter, ITimerStopper } from "../../../src/useCases";

export class MockTriggerGateway extends GateWay<{}>
    implements ITimerStopper, ITriggerReceiver, ITimerSetter, ITimerRead {
    getNext = jest.fn(() => new Date());
    set = jest.fn();
    trigger = jest.fn();
    stop = jest.fn();
}
