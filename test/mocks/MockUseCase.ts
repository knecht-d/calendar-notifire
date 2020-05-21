import { UseCase } from "../../src/useCases/UseCase";
import { MockLogger } from "./external/MockLogger";

export class MockUseCase extends UseCase<any> {
    _execute = jest.fn();
    execute = jest.fn();
    constructor() {
        super(new MockLogger());
    }
}
