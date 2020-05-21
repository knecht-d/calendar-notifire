import { Logger, LogLevels } from "../../../../src/external";

describe("Logger", () => {
    beforeEach(() => {
        jest.spyOn(global.console, "error")
            .mockReturnValue()
            .mockClear();
        jest.spyOn(global.console, "warn")
            .mockReturnValue()
            .mockClear();
        jest.spyOn(global.console, "info")
            .mockReturnValue()
            .mockClear();
        jest.spyOn(global.console, "log")
            .mockReturnValue()
            .mockClear();
        jest.spyOn(global.console, "debug")
            .mockReturnValue()
            .mockClear();
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
        const error = new Error();
        logger.error("error", error);
        logger.warn("warn");
        logger.info("info");
        logger.verbose("log");
        logger.debug("debug");

        expect.assertions(level + 1);
        functionNames.forEach(logFunction => {
            if (logFunction === "error") {
                expect(console[logFunction]).toHaveBeenCalledWith(logFunction, error);
                return;
            }
            // @ts-ignore
            expect(console[logFunction]).toHaveBeenCalledWith(logFunction);
        });
    });
});
