"Lib";

const redisClient = require("redis-connection")();
const { promisify } = require("util");

/**
 * @param {string} key
 * @returns {Promise<Array<string>>}
 */
const lrangeAsync = promisify(redisClient.lrange).bind(redisClient);
/**
 * @param {string} key
 * @returns {Promise<Array<string>>}
 */
const hgetallAsync = promisify(redisClient.hgetall).bind(redisClient);

/**
 * @param {number} pc
 * @param {number} p
 * @returns {string} 
 */
const getChangeAmount = (pc, p) => {
  return (Math.round(((p - pc) + Number.EPSILON) * 100) / 100).toString();
};

/**
 * @param {number} pc
 * @param {number} p
 * @returns {string}
 */
const getChangeDirection = (pc, p) => {
  if (pc > p) {
    return "down";
  } else if (pc < p) {
    return "up";
  } else if (pc === p) {
    return "equal";
  }
  throw new Error("Comparing pricess error");
};

/**
 * @param {string} stock
 * @returns {Promise<object>}
 */
const getStockTickerData = async (stock) => {
  const res = await hgetallAsync(stock);

  if (typeof res.pc !== "undefined") {
    const pcFloat = parseFloat(res.pc);
    const pFloat = parseFloat(res.p);

    res.cd = getChangeDirection(pcFloat, pFloat);
    res.ca = getChangeAmount(pcFloat, pFloat);
  } else {
    res.error = "Previous day's closing price not available";
  }

  return res;
};

/**
 * @param {string} tickerFromUrl
 * @returns {Promise<object>}
 */
const getStockTickers = (tickerFromUrl) => {
  const tickerParts = tickerFromUrl.split("/");
  return Promise.all(tickerParts.map((stock) => getStockTickerData(stock)));
};

/**
 * @returns {Promise<object[]>}
 */
const getSymbols = async () => {
  const symbols = await lrangeAsync("symbols", 0, -1);
  return symbols.map((symbol) => JSON.parse(symbol));
};

exports.getSymbols = getSymbols;
exports.getStockTickers = getStockTickers;