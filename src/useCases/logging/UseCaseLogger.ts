export interface IUseCaseLogger {
    error: (message: string | Error) => void;
    warn: (message: string | Error) => void;
    info: (message: string | Error) => void;
    timerStart: () => string;
    timerStop: (key: string, message: string) => void;
    verbose: (message: string | Error) => void;
    debug: (message: string | Error) => void;
}
