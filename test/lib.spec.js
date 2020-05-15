"use strict";

require("dotenv").config();
const Lab = require("@hapi/lab");
const { describe, it } = exports.lab = Lab.script();
const { expect } = require("@hapi/code");
const sinon = require("sinon");
const Rewire = require("rewire");

const myModule = Rewire("../src/lib.js");

describe("lib", () => {
  it("getSymbols", async () => {
    const lrangeAsync = sinon.spy(() => {
      return [
        `{"description":"APPLE INC","displaySymbol":"AAPL","symbol":"AAPL"}`,
        `{"description":"MICROSOFT CORP","displaySymbol":"MSFT","symbol":"MSFT"}`
      ];
    });

    myModule.__set__("lrangeAsync", lrangeAsync);

    const requiredSymbols = [
      { description: "APPLE INC", displaySymbol: "AAPL", symbol: "AAPL" },
      {
        description: "MICROSOFT CORP",
        displaySymbol: "MSFT",
        symbol: "MSFT"
      }
    ];

    const symbols = await myModule.getSymbols();
    expect(symbols).to.equal(requiredSymbols);
  });

  it("getStockTickers", async () => {
    const hgetallAsyncStub = sinon.stub();
    hgetallAsyncStub
      .withArgs("AAPL")
      .resolves({ "pc": "307.65", "p": "309.8482", "s": "AAPL", "t": "1589486883372", "v": "195" })
      .withArgs("MSFT")
      .resolves({ "pc": "189.75", "p": "181", "s": "MSFT", "t": "1589486884772", "v": "1" });

    myModule.__set__("hgetallAsync", hgetallAsyncStub);

    const requiredTickets = [
      {
        "pc": "307.65",
        "p": "309.8482",
        "s": "AAPL",
        "t": "1589486883372",
        "v": "195",
        "cd": "up",
        "ca": "2.2"
      },
      {
        "pc": "189.75",
        "p": "181",
        "s": "MSFT",
        "t": "1589486884772",
        "v": "1",
        "cd": "down",
        "ca": "-8.75"
      }
    ];

    const tickers = await myModule.getStockTickers("AAPL/MSFT");
    expect(tickers).to.equal(requiredTickets);
  });
});