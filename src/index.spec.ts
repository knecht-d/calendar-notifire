import { expect } from "chai";
import "mocha";
import { helloTest } from "./index";

describe("First test", () => {
    it("should return true by default", () => {
        const result = helloTest();
        expect(result).to.equal(true);
    });
    it("should return false if given true", () => {
        const result = helloTest(true);
        expect(result).to.equal(false);
    });
    it("should return true if given false", () => {
        const result = helloTest(false);
        expect(result).to.equal(true);
    });
});
