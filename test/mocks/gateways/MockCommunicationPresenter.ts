import { IErrorReporter } from "../../../src/gateways";
import { GateWay } from "../../../src/gateways/GateWay";
import {
    IDeleteConfigCommunication,
    IEventCommunication,
    IInitCommunication,
    ISetConfigCommunication,
    IReadConfigCommunication,
} from "../../../src/useCases";

export class MockCommunicationPresenter extends GateWay<{}>
    implements
        ISetConfigCommunication,
        IReadConfigCommunication,
        IDeleteConfigCommunication,
        IInitCommunication,
        IEventCommunication,
        IErrorReporter {
    sendReadConfig = jest.fn();
    sendDeleteConfigSuccess = jest.fn();
    sendDeleteConfigError = jest.fn();
    sendSetConfigSuccess = jest.fn();
    sendSetConfigError = jest.fn();
    sendInitSuccess = jest.fn();
    sendInitError = jest.fn();
    sendEvents = jest.fn();
    sendError = jest.fn();
    sendCommunicationError = jest.fn();
}
