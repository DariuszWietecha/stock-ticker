"use strict";

const lib = require("./lib");
const Hapi = require("@hapi/hapi");

const init = async () => {
  const server = Hapi.server({
    debug: {
      request: JSON.parse(process.env.REQUEST_LOG_RULE),
      log: JSON.parse(process.env.SERVER_LOG_RULE)
    },
    port: 3000,
    host: "localhost"
  });

  server.method("getStockTickers", lib.getStockTickers, {
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
    handler: () => lib.getSymbols()
  });

  await server.start();
  // tslint:disable-next-line:no-console
  server.log("info", `Server running on ${server.info.uri}`, server.info.uri);
};

process.on("unhandledRejection", (err) => {
  // tslint:disable-next-line:no-console
  console.log(err);
  process.exit(1);
});

init();