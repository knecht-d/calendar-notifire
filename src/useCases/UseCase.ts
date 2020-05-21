import { IUseCaseLogger } from "./logging";

export abstract class UseCase<In> {
    constructor(protected logger: IUseCaseLogger) {}
    protected abstract _execute(input: In): Promise<void>;
    public async execute(input: In) {
        this.logger.debug(`${this.constructor.name} executed${input ? ` with ${JSON.stringify(input)}` : ""}`);
        const timekey = this.logger.timerStart();
        await this._execute(input);
        this.logger.timerStop(timekey, this.constructor.name);
    }
}
