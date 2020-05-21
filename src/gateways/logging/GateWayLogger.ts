import { IUseCaseLogger } from "../../useCases";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IGateWayLogger extends IUseCaseLogger {}
export type Level = "error" | "warn" | "info" | "verbose" | "debug";
export function logCall({ level }: { level: Level } = { level: "info" }): MethodDecorator {
    return function(
        target: object,
        propertyKey: string | symbol,
        propertyDesciptor: PropertyDescriptor,
    ): PropertyDescriptor {
        const actualMethod = propertyDesciptor.value;

        propertyDesciptor.value = function(...args: any[]) {
            const logger: IGateWayLogger | undefined = (this as any).logger;
            const params = args.map(a => JSON.stringify(a)).join(", ");

            logger?.[level]?.(`${this.constructor.name}`, `${String(propertyKey)}(${params})`);

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
                const logger: IGateWayLogger | undefined = (this as any).logger;
                const timekey = logger?.timerStart();
                const actualResult = await actualMethod.apply(this, args);
                logger?.timerStop(timekey!, `${this.constructor.name}`, String(propertyKey));
                return actualResult;
            };
        } else {
            propertyDesciptor.value = function(...args: any[]) {
                const logger: IGateWayLogger | undefined = (this as any).logger;
                const timekey = logger?.timerStart();
                const actualResult = actualMethod.apply(this, args);
                logger?.timerStop(timekey!, `${this.constructor.name}`, String(propertyKey));
                return actualResult;
            };
        }
        return propertyDesciptor;
    };
}
