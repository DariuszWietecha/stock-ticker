"use strict";

const Lib = require("./lib");
const Hapi = require("@hapi/hapi");
const Path = require("path");
const Inert = require("@hapi/inert");

exports.createServer = async () => {
  const server = Hapi.server({
    debug: {
      request: JSON.parse(process.env.REQUEST_LOG_RULE),
      log: JSON.parse(process.env.SERVER_LOG_RULE)
    },
    host: process.env.HOST || "0.0.0.0",
    port: process.env.PORT || 8080,
    routes: {
      files: {
        relativeTo: Path.join(__dirname, "../public")
      }
    }
  });

  server.register(Inert);

  server.method("getStockTickers", Lib.getStockTickers, {
    cache: {
      expiresIn: 1000,
      generateTimeout: 2000
    }
  });

  server.route({
    method: "GET",
    path: "/tickers/{ticker*}",
    handler: (request) => server.methods.getStockTickers(request.params.ticker)
  });

  server.route({
    method: "GET",
    path: "/symbols",
    handler: () => Lib.getSymbols()
  });

  server.route({
    method: "GET",
    path: "/loaderio-c7933e1ff0a2f4e68de7b65957153cf4.txt",
    handler: {
      file: "loaderio-c7933e1ff0a2f4e68de7b65957153cf4.txt"
    }
  });

  process.on("unhandledRejection", (error) => {
    // tslint:disable-next-line:no-console
    console.log(error);
    process.exit(1);
  });

  return server;
};
