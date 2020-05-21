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

    error(location: string, message: string | Error) {
        console.error(location, message);
    }
    warn(location: string, message: string | Error) {
        if (this.level >= LogLevels.warn) {
            console.warn(location, message);
        }
    }
    info(location: string, message: string | Error) {
        if (this.level >= LogLevels.info) {
            console.info(location, message);
        }
    }
    timerStart() {
        const key = Math.random()
            .toString(36)
            .substr(2, 9);
        this.timers[key] = process.hrtime();
        return key;
    }
    timerStop(key: string, location: string, message: string) {
        const time = process.hrtime(this.timers[key]);
        this.info(location, `Execution time [${message}]: ${time[0]}s ${time[1] / 1000000}ms`);
    }
    verbose(location: string, message: string | Error) {
        if (this.level >= LogLevels.verbose) {
            console.log(location, message);
        }
    }
    debug(location: string, message: string | Error) {
        if (this.level >= LogLevels.debug) {
            console.debug(location, message);
        }
    }
}

type Level = "error" | "warn" | "info" | "verbose" | "debug";
const levelToFunction: { [key: number]: Level } = {
    [LogLevels.error]: "error",
    [LogLevels.warn]: "warn",
    [LogLevels.info]: "info",
    [LogLevels.verbose]: "verbose",
    [LogLevels.debug]: "debug",
};

export function logCall({ level }: { level: LogLevels } = { level: LogLevels.info }): MethodDecorator {
    return function(
        target: object,
        propertyKey: string | symbol,
        propertyDesciptor: PropertyDescriptor,
    ): PropertyDescriptor {
        const actualMethod = propertyDesciptor.value;

        propertyDesciptor.value = function(...args: any[]) {
            const logger: ILogger | undefined = (this as any).logger;
            const params = args.map(a => JSON.stringify(a)).join(", ");

            logger?.[levelToFunction[level]]?.(`${this.constructor.name}`, `${String(propertyKey)}(${params})`);

            const actualResult = actualMethod.apply(this, args);
            return actualResult;
        };
        return propertyDesciptor;
    };
}

export function logTime({ async } = { async: false }): MethodDecorator {
    return function(
        target: object,
        propertyKey: string | symbol,
        propertyDesciptor: PropertyDescriptor,
    ): PropertyDescriptor {
        const actualMethod = propertyDesciptor.value;
        if (async) {
            propertyDesciptor.value = async function(...args: any[]) {
                const logger: ILogger | undefined = (this as any).logger;
                const timekey = logger?.timerStart();
                const actualResult = await actualMethod.apply(this, args);
                logger?.timerStop(timekey!, `${this.constructor.name}`, String(propertyKey));
                return actualResult;
            };
        } else {
            propertyDesciptor.value = function(...args: any[]) {
                const logger: ILogger | undefined = (this as any).logger;
                const timekey = logger?.timerStart();
                const actualResult = actualMethod.apply(this, args);
                logger?.timerStop(timekey!, `${this.constructor.name}`, String(propertyKey));
                return actualResult;
            };
        }
        return propertyDesciptor;
    };
}
