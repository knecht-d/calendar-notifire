import { IPerrsistence } from "../../gateways";

export abstract class AbstractStorage<SetupData> implements IPerrsistence {
    constructor(protected setupData: SetupData) {}

    abstract readAll(): { [key: string]: string };
    abstract save(key: string, value: string): void;
}
