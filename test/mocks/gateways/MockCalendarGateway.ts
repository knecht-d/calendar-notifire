import { IEventProvider } from "../../../src/useCases";
import { GateWay } from "../../../src/gateways/GateWay";

export class MockCalendarGateway extends GateWay<{}> implements IEventProvider {
    getEventsBetween = jest.fn();
}
