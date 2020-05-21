import { ICommunicationIn } from "../../../src/gateways";
import { GateWay } from "../../../src/gateways/GateWay";

export class MockCommunicationController extends GateWay<{}> implements ICommunicationIn {
    set = jest.fn();
    delete = jest.fn();
    initChat = jest.fn();
    addAdmin = jest.fn();
    removeAdmin = jest.fn();
    read = jest.fn();
}
