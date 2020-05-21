import { ILogger } from "./logging";

export abstract class External {
    constructor(protected logger: ILogger) {}
}
