import { AbstractStorage } from "../../../src/external";

export class MockStorage extends AbstractStorage<{}> {
    readAll = jest.fn();
    save = jest.fn();
    get = jest.fn();

    constructor(setupData: {}) {
        super(setupData);
    }
}
