import { GateWay } from "../../../src/gateways/GateWay";
import { IUpdateCommunication, IInitCommunication, IEventCommunication } from "../../../src/useCases";
import { IErrorReporter } from "../../../src/gateways";

export class MockCommunicationPresenter extends GateWay<{}>
    implements IUpdateCommunication, IInitCommunication, IEventCommunication, IErrorReporter {
    sendUpdateSuccess = jest.fn();
    sendUpdateError = jest.fn();
    sendInitSuccess = jest.fn();
    sendInitError = jest.fn();
    sendEvents = jest.fn();
    sendError = jest.fn();
    sendCommunicationError = jest.fn();
}
