import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import "mocha";
import nock from "nock";
import { get, post } from "./http";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("http", () => {
    describe("get", () => {
        it("should give the correct result", async function() {
            nock("https://example.com")
                .get("/get")
                .reply(200, { some: "response" });
            const response = await get("https://example.com/get");
            expect(response).to.deep.equal({ some: "response" });
        });
        it("should throw an error", async function() {
            nock("https://example.com")
                .get("/get")
                .reply(404);
            expect(get("https://example.com/get")).to.eventually.throw();
        });
    });
    describe("post", () => {
        it("should give the correct result", async function() {
            nock("https://example.com")
                .post("/echo")
                .reply(201, (uri, requestBody) => requestBody);
            const response = await post("https://example.com/echo", { test: "data" });
            expect(response).to.deep.equal({ test: "data" });
        });
        it("should throw an error", async function() {
            nock("https://example.com")
                .post("/echo")
                .reply(404);
            expect(post("https://example.com/echo", { test: "data" })).to.eventually.throw();
        });
    });
});
