"use strict";

require("dotenv").config();
const { createServer } = require("./src/createServer");

(async () => {
  const server = await createServer();
  await server.initialize();
  await server.start();
  server.log("info", `Server running on ${server.info.uri}`, server.info.uri);
})();
