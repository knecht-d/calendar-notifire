import { AbstractStorage } from "../../../src/external";

export class MockStorage extends AbstractStorage<{}> {
    public storedData: { [key: string]: string } = {};

    readAll = jest.fn(() => {
        return this.storedData;
    });
    save = jest.fn((key: string, value: string) => {
        return (this.storedData[key] = value);
    });

    constructor(setupData: {}) {
        super(setupData);
    }
}
