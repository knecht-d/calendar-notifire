import { IPerrsistence } from "../../gateways";
import { readFileSync, existsSync, writeFileSync } from "fs";

export class SimpleFileStorage implements IPerrsistence {
    private file: string;
    private data: { [key: string]: string } = {};
    constructor(file: string) {
        const root = `${__dirname}/../../..`;
        this.file = `${root}/${file}`;
    }

    readAll() {
        if (!existsSync(this.file)) {
            return;
        }
        const rawData = readFileSync(this.file, { encoding: "utf8" });
        this.data = JSON.parse(rawData);
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
