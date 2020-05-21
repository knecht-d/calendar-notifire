export interface IUseCaseLogger {
    error: (location: string, message: string | Error) => void;
    warn: (location: string, message: string | Error) => void;
    info: (location: string, message: string | Error) => void;
    timerStart: () => string;
    timerStop: (key: string, location: string, message: string) => void;
    verbose: (location: string, message: string | Error) => void;
    debug: (location: string, message: string | Error) => void;
}

export function logExecute(): MethodDecorator {
    return function(
        target: object,
        propertyKey: string | symbol,
        propertyDesciptor: PropertyDescriptor,
    ): PropertyDescriptor {
        const actualMethod = propertyDesciptor.value;

        propertyDesciptor.value = async function(...args: any[]) {
            const logger: IUseCaseLogger | undefined = (this as any).logger;
            const params = args.map(a => JSON.stringify(a)).join(", ");
            logger?.info(`${this.constructor.name}`, `${String(propertyKey)}(${params})`);
            const timekey = logger?.timerStart();

            const actualResult = await actualMethod.apply(this, args);

            logger?.timerStop(timekey!, `${this.constructor.name}`, "execute");
            return actualResult;
        };
        return propertyDesciptor;
    };
}
