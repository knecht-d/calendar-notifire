import { getLogger, Logger as Logger4js } from "log4js";
import { Logger, LogLevels } from "../../../../src/external";

jest.mock("log4js");
describe("Logger", () => {
    let mockLoger: Partial<Logger4js>;
    beforeEach(() => {
        mockLoger = {
            error: jest.fn(),
            warn: jest.fn(),
            info: jest.fn(),
            log: jest.fn(),
            debug: jest.fn(),
        };
        (getLogger as jest.Mock).mockReturnValue(mockLoger);
    });
    const cases: [LogLevels, string[]][] = [
        [LogLevels.error, ["error"]],
        [LogLevels.warn, ["error", "warn"]],
        [LogLevels.info, ["error", "warn", "info"]],
        [LogLevels.verbose, ["error", "warn", "info", "log"]],
        [LogLevels.debug, ["error", "warn", "info", "log", "debug"]],
    ];

    it.each(cases)("level %s should result in logging %j", (level, functionNames) => {
        const logger = new Logger(level);
        logger.error("Test", "error");
        logger.warn("Test", "warn");
        logger.info("Test", "info");
        logger.verbose("Test", "log");
        logger.debug("Test", "debug");

        expect.assertions(level + 1);
        functionNames.forEach(logFunction => {
            // @ts-ignore
            expect(mockLoger[logFunction]).toHaveBeenCalledWith("Test", logFunction);
        });
    });

    it("should log the executionTime as info", done => {
        const logger = new Logger(LogLevels.info);
        const key1 = logger.timerStart();
        const key2 = logger.timerStart();
        logger.timerStop(key1, "Test", "One");
        expect(mockLoger.info).toHaveBeenNthCalledWith(
            1,
            "Test",
            expect.stringMatching(/Execution time \[One\]: 0s [0-9]+\.[0-9]+ms/),
        );
        setTimeout(() => {
            logger.timerStop(key2, "Test", "Two");
            expect(mockLoger.info).toHaveBeenNthCalledWith(
                2,
                "Test",
                expect.stringMatching(/Execution time \[Two\]: 1s [0-9]+\.[0-9]+ms/),
            );
            done();
        }, 1000);
    }, 1100);
});
