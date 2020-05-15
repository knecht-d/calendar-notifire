import { IErrorReporter } from "../../../src/gateways";
import { GateWay } from "../../../src/gateways/GateWay";
import { ICommunication } from "../../../src/useCases";

export class MockCommunicationPresenter extends GateWay<{}> implements ICommunication, IErrorReporter {
    send = jest.fn();
    sendError = jest.fn();
    sendCommunicationError = jest.fn();
}
