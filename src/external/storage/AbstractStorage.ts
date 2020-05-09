import { IPerrsistence } from "../../gateways";

export abstract class AbstractStorage<SetupData> implements IPerrsistence {
    constructor(protected setupData: SetupData) {}

    abstract save(key: string, value: string): void;
}
