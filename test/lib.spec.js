"use strict";

require("dotenv").config();
const Lab = require("@hapi/lab");
const { describe, it } = exports.lab = Lab.script();
const { expect } = require("@hapi/code");
const sinon = require("sinon");
const Rewire = require("rewire");

const libModule = Rewire("../src/lib.js");

describe("lib", () => {
  it("getSymbols", async () => {
    const lrangeAsync = sinon.stub().resolves([
      `{"description":"APPLE INC","displaySymbol":"AAPL","symbol":"AAPL"}`,
      `{"description":"MICROSOFT CORP","displaySymbol":"MSFT","symbol":"MSFT"}`
    ]);

    libModule.__set__("lrangeAsync", lrangeAsync);

    const requiredSymbols = [
      { description: "APPLE INC", displaySymbol: "AAPL", symbol: "AAPL" },
      { description: "MICROSOFT CORP", displaySymbol: "MSFT", symbol: "MSFT" }
    ];

    const symbols = await libModule.getSymbols();
    expect(symbols).to.equal(requiredSymbols);
  });

  describe("getStockTickers", () => {
    it("up, down, equal, Previous day's closing price not available", async () => {
      const hgetallAsyncStub = sinon.stub();
      hgetallAsyncStub
        .withArgs("AAPL")
        .resolves({ "pc": "307.65", "p": "309.8482", "s": "AAPL", "t": "1589486883372", "v": "195" })
        .withArgs("MSFT")
        .resolves({ "pc": "189.75", "p": "181", "s": "MSFT", "t": "1589486884772", "v": "1" })
        .withArgs("TEST")
        .resolves({ "pc": "181", "p": "181", "s": "TEST", "t": "1589486884772", "v": "1" })
        .withArgs("TEST1")
        .resolves({ "p": "181", "s": "TEST1", "t": "1589486884772", "v": "1", "error": "Previous day's closing price not available"});

      libModule.__set__("hgetallAsync", hgetallAsyncStub);

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
        },
        {
          "pc": "181",
          "p": "181",
          "s": "TEST",
          "t": "1589486884772",
          "v": "1",
          "cd": "equal",
          "ca": "0"
        },
        {
          "p": "181",
          "s": "TEST1",
          "t": "1589486884772",
          "v": "1",
          "error": "Previous day's closing price not available"
        }
      ];

      const tickers = await libModule.getStockTickers("AAPL/MSFT/TEST/TEST1");
      expect(tickers).to.equal(requiredTickets);
    });

    it("Comparing pricess error", async () => {
      const hgetallAsyncStub = sinon.stub();
      hgetallAsyncStub
        .withArgs("TEST1")
        .resolves({ "pc": "181", "s": "TEST1", "t": "1589486884772", "v": "1" });

      libModule.__set__("hgetallAsync", hgetallAsyncStub);

      libModule.getStockTickers("TEST1")
        .then(null, (error) => {
          expect(error).to.equal(new Error("Comparing pricess error"));
        });
    });
  });
});