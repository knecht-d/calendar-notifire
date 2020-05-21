import { IPerrsistence } from "../../gateways";
import { External } from "../External";
import { ILogger } from "../logging";

export abstract class AbstractStorage<SetupData> extends External implements IPerrsistence {
    constructor(logger: ILogger, protected setupData: SetupData) {
        super(logger);
    }

    abstract readAll(): { [key: string]: string };
    abstract save(key: string, value: string): void;
}
