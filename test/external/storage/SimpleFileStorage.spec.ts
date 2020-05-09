import { existsSync, readFileSync, writeFileSync } from "fs";
import { SimpleFileStorage } from "../../../src/external";

jest.mock("fs");
describe("SimpleFileStorage", () => {
    describe("readAll", () => {
        it("should not try to read the file if it does not exist", () => {
            (existsSync as jest.Mock).mockReturnValue(false);
            const storage = new SimpleFileStorage({ file: "data/test.json" });
            storage.readAll();
            expect(readFileSync).not.toHaveBeenCalled();
        });
        it("should read and parse the file if it does exist", () => {
            (existsSync as jest.Mock).mockReturnValue(true);
            (readFileSync as jest.Mock).mockReturnValue('{"data": "someData"}');
            const storage = new SimpleFileStorage({ file: "data/test.json" });
            storage.readAll();
            expect(readFileSync).toHaveBeenCalledWith(
                expect.stringMatching(new RegExp(".*/\\.\\./\\.\\./\\.\\./data/test\\.json$")),
                {
                    encoding: "utf8",
                },
            );
            expect(storage.get("data")).toEqual("someData");
        });
    });
    describe("get", () => {
        it("should get the key", () => {
            (existsSync as jest.Mock).mockReturnValue(true);
            (readFileSync as jest.Mock).mockReturnValue('{"data": "someData"}');
            const storage = new SimpleFileStorage({ file: "data/test.json" });
            expect(storage.get("data")).toEqual("someData");
        });
        it("should fail if the key is not there", () => {
            (existsSync as jest.Mock).mockReturnValue(false);
            const storage = new SimpleFileStorage({ file: "data/test.json" });
            expect(() => {
                storage.get("notExistingData");
            }).toThrow("Key [notExistingData] not found");
        });
        it("should not fail if the key is ans empty string", () => {
            (existsSync as jest.Mock).mockReturnValue(true);
            (readFileSync as jest.Mock).mockReturnValue('{"data": ""}');
            const storage = new SimpleFileStorage({ file: "data/test.json" });
            let result = "wrongResult";
            expect(() => {
                result = storage.get("data");
            }).not.toThrow();
            expect(result).toEqual("");
        });
    });
    describe("save", () => {
        it("should set a new key", () => {
            (existsSync as jest.Mock).mockReturnValue(false);
            const storage = new SimpleFileStorage({ file: "data/test.json" });
            storage.save("newKey", "newData");
            expect(writeFileSync).toHaveBeenLastCalledWith(
                expect.stringMatching(new RegExp(".*/\\.\\./\\.\\./\\.\\./data/test\\.json$")),
                '{"newKey":"newData"}',
                {
                    encoding: "utf8",
                },
            );
        });
        it("should keep old data", () => {
            (existsSync as jest.Mock).mockReturnValue(true);
            (readFileSync as jest.Mock).mockReturnValue('{"data": "someData"}');
            const storage = new SimpleFileStorage({ file: "data/test.json" });
            storage.save("newKey", "newData");
            expect(writeFileSync).toHaveBeenLastCalledWith(
                expect.stringMatching(new RegExp(".*/\\.\\./\\.\\./\\.\\./data/test\\.json$")),
                '{"data":"someData","newKey":"newData"}',
                {
                    encoding: "utf8",
                },
            );
        });
    });
});
