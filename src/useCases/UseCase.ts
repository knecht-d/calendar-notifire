import { IUseCaseLogger } from "./logging";

export abstract class UseCase<In> {
    constructor(protected logger: IUseCaseLogger) {}
    public abstract execute(input: In): Promise<void>;
}
