import { ILogger } from "../../../src/external/logging";

export class MockLogger implements ILogger {
    error = jest.fn();
    warn = jest.fn();
    info = jest.fn();
    verbose = jest.fn();
    debug = jest.fn();
    timerStart = jest.fn().mockReturnValue("timerKey");
    timerStop = jest.fn();
}
