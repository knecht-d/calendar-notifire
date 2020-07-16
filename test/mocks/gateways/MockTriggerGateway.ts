import { ITriggerReceiver } from "../../../src/gateways";
import { GateWay } from "../../../src/gateways/GateWay";
import { ITriggerRead, ITriggerSetter, ITriggerStopper } from "../../../src/useCases";

export class MockTriggerGateway extends GateWay<{}>
    implements ITriggerStopper, ITriggerReceiver, ITriggerSetter, ITriggerRead {
    getNext = jest.fn(() => new Date());
    set = jest.fn();
    trigger = jest.fn();
    stop = jest.fn();
}
