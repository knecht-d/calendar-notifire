import { IErrorReporter } from "../../../src/gateways";
import { GateWay } from "../../../src/gateways/GateWay";
import {
    IDeleteConfigCommunication,
    IEventCommunication,
    IInitCommunication,
    IUpdateCommunication,
    IReadConfigCommunication,
} from "../../../src/useCases";

export class MockCommunicationPresenter extends GateWay<{}>
    implements
        IUpdateCommunication,
        IReadConfigCommunication,
        IDeleteConfigCommunication,
        IInitCommunication,
        IEventCommunication,
        IErrorReporter {
    sendReadConfig = jest.fn();
    sendDeleteConfigSuccess = jest.fn();
    sendDeleteConfigError = jest.fn();
    sendUpdateSuccess = jest.fn();
    sendUpdateError = jest.fn();
    sendInitSuccess = jest.fn();
    sendInitError = jest.fn();
    sendEvents = jest.fn();
    sendError = jest.fn();
    sendCommunicationError = jest.fn();
}
