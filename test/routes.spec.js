"use strict";

require("dotenv").config();
const Lab = require("@hapi/lab");
const { expect } = require("@hapi/code");
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require("../src/server");

describe("Routes", () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    it("GET /tickers/AAPL/MSFT responds with 200", async () => {
        const res = await server.inject({
            method: "get",
            url: "/tickers/AAPL/MSFT"
        });
        expect(res.statusCode).to.equal(200);
    });

    it("GET /symbols responds with 200", async () => {
        const res = await server.inject({
            method: "get",
            url: "/symbols"
        });
        expect(res.statusCode).to.equal(200);
    });

    it("GET / responds with 404", async () => {
        const res = await server.inject({
            method: "get",
            url: "/"
        });
        expect(res.statusCode).to.equal(404);
    });
});