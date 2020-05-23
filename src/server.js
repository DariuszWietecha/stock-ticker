"use strict";

const Lib = require("./lib");
const Hapi = require("@hapi/hapi");

const server = Hapi.server({
  debug: {
    request: JSON.parse(process.env.REQUEST_LOG_RULE),
    log: JSON.parse(process.env.SERVER_LOG_RULE)
  },
  port: process.env.PORT || 8080,
  host: process.env.HOST || "0.0.0.0"
});

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
  method: 'GET',
  path: '/loaderio-c7933e1ff0a2f4e68de7b65957153cf4.txt',
  handler: {
      file: '/public/loaderio-c7933e1ff0a2f4e68de7b65957153cf4.txt'
  }
});

exports.init = async () => {
  await server.initialize();
  return server;
};

exports.start = async () => {
  await server.start();
  server.log("info", `Server running on ${server.info.uri}`, server.info.uri);
  return server;
};

process.on("unhandledRejection", (error) => {
  // tslint:disable-next-line:no-console
  console.log(error);
  process.exit(1);
});
