'use strict';

require("dotenv").config();
const redisClient = require('redis-connection')();
const Hapi = require('@hapi/hapi');

function getStockTickerData(stock) {
  return new Promise((resolve, reject) => {
    redisClient.hgetall(stock, function (err, reply) {
      if (err) { reject(); }

      // tslint:disable-next-line:no-console
      console.log(`${stock}: `, reply);
      if (reply.pc !== 0) {
        const pcInt = parseFloat(reply.pc, 10);
        const pInt = parseFloat(reply.p, 10);

        reply.cd = getChangeDirection(pcInt, pInt);
        reply.ca = Math.round(((pInt - pcInt) + Number.EPSILON) * 100) / 100;
      } else {
        reply.error = "Previous day's closing price not available";
      }

      resolve(reply);
    });
  });
}

function getSymbols() {
  return new Promise((resolve, reject) => {
    redisClient.lrange("symbols", 0, -1, function (err, reply) {
      if (err) { reject(); }

      resolve(reply.map((symbol) => JSON.parse(symbol)));
    });
  });
}

function getChangeDirection(pc, p) {
  const pcInt = parseInt(pc, 10);
  const pInt = parseInt(p, 10);
  if (pcInt > pInt) {
    return "down";
  } else if (pcInt < pInt) {
    return "up";
  } else if (pcInt < pInt) {
    return "equal";
  }
  throw new Error("Comparing pricess error");
}

const init = async () => {

  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  server.route({
    method: 'GET',
    path: '/tickers/{ticker*}',
    handler: (request, h) => {
      const tickerParts = request.params.ticker.split('/');
      return Promise.all(tickerParts.map((stock) => getStockTickerData(stock)));
    }
  });

  server.route({
    method: 'GET',
    path: '/symbols',
    handler: (request, h) => getSymbols()
  });

  await server.start();
  // tslint:disable-next-line:no-console
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
// tslint:disable-next-line:no-console
  console.log(err);
  process.exit(1);
});

init();