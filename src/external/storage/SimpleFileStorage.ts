import { existsSync, readFileSync, writeFileSync } from "fs";
import { ILogger } from "../logging";
import { AbstractStorage } from "./AbstractStorage";

export class SimpleFileStorage extends AbstractStorage<{ file: string }> {
    private file: string;
    private data: { [key: string]: string } = {};

    constructor(logger: ILogger, setupData: { file: string }) {
        super(logger, setupData);
        const root = `${__dirname}/../../..`;
        this.file = `${root}/${this.setupData.file}`;
    }

    readAll() {
        if (!existsSync(this.file)) {
            return {};
        }
        const rawData = readFileSync(this.file, { encoding: "utf8" });
        this.data = JSON.parse(rawData);
        return this.data;
    }

    save(key: string, value: string) {
        this.readAll();
        this.data[key] = value;
        writeFileSync(this.file, JSON.stringify(this.data), { encoding: "utf8" });
    }

    get(key: string) {
        this.readAll();
        const result = this.data[key];
        if (!result && result !== "") {
            throw Error(`Key [${key}] not found`);
        }
        return this.data[key];
    }
}
