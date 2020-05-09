import nock from "nock";
import { get, post } from "../../../src/external/http/http";

describe("http", () => {
    describe("get", () => {
        it("should give the correct result", async function() {
            nock("https://example.com")
                .defaultReplyHeaders({ "access-control-allow-origin": "*" })
                .get("/get")
                .reply(200, { some: "response" });
            const response = await get("https://example.com/get");
            expect(response).toEqual({ some: "response" });
        });
        it("should throw an error", async function() {
            nock("https://example.com")
                .defaultReplyHeaders({ "access-control-allow-origin": "*" })
                .get("/get")
                .reply(404);
            await expect(get("https://example.com/get")).rejects.toEqual(
                new Error("Request failed with status code 404"),
            );
        });
    });
    describe("post", () => {
        it("should give the correct result", async function() {
            nock("https://example.com")
                .defaultReplyHeaders({ "access-control-allow-origin": "*" })
                .post("/echo")
                .reply(201, (uri, requestBody) => requestBody);
            const response = await post("https://example.com/echo", { test: "data" });
            expect(response).toEqual({ test: "data" });
        });
        it("should throw an error", async function() {
            nock("https://example.com")
                .defaultReplyHeaders({ "access-control-allow-origin": "*" })
                .post("/echo")
                .reply(404);
            await expect(post("https://example.com/echo", { test: "data" })).rejects.toEqual(
                new Error("Request failed with status code 404"),
            );
        });
    });
});
