import { IGateWayLogger } from "../../gateways";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ILogger extends IGateWayLogger {}

export enum LogLevels {
    error = 0,
    warn = 1,
    info = 2,
    verbose = 3,
    debug = 4,
}

export class Logger implements ILogger {
    constructor(private level: LogLevels) {}

    error(message: string, error?: Error | undefined) {
        console.error(message, error);
    }
    warn(message: string) {
        if (this.level >= LogLevels.warn) {
            console.warn(message);
        }
    }
    info(message: string) {
        if (this.level >= LogLevels.info) {
            console.info(message);
        }
    }
    verbose(message: string) {
        if (this.level >= LogLevels.verbose) {
            console.log(message);
        }
    }
    debug(message: string) {
        if (this.level >= LogLevels.debug) {
            console.debug(message);
        }
    }
}
