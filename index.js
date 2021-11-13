"use strict";

const { db } = require("./src/models");
const server = require("./src/server.js");
require("dotenv").config();

db.sync().then(() => {
  server.start(process.env.PORT || 3030);
});
