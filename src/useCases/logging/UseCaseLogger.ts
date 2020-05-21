export interface IUseCaseLogger {
    error: (message: string, error?: Error) => void;
    warn: (message: string) => void;
    info: (message: string) => void;
    verbose: (message: string) => void;
    debug: (message: string) => void;
}
