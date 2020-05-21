import { IUseCaseLogger } from "./logging";

export abstract class UseCase<In> {
    constructor(protected logger: IUseCaseLogger) {}
    abstract execute(input: In): Promise<void>;
}
