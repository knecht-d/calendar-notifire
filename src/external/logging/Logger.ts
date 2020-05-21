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
    private timers: { [key: string]: [number, number] };
    constructor(private level: LogLevels) {
        this.timers = {};
    }

    error(message: string | Error) {
        console.error(message);
    }
    warn(message: string | Error) {
        if (this.level >= LogLevels.warn) {
            console.warn(message);
        }
    }
    info(message: string | Error) {
        if (this.level >= LogLevels.info) {
            console.info(message);
        }
    }
    timerStart() {
        const key = Math.random()
            .toString(36)
            .substr(2, 9);
        this.timers[key] = process.hrtime();
        return key;
    }
    timerStop(key: string, message: string) {
        const time = process.hrtime(this.timers[key]);
        this.info(`Execution time [${message}]: ${time[0]}s ${time[1] / 1000000}ms`);
    }
    verbose(message: string | Error) {
        if (this.level >= LogLevels.verbose) {
            console.log(message);
        }
    }
    debug(message: string | Error) {
        if (this.level >= LogLevels.debug) {
            console.debug(message);
        }
    }
}
