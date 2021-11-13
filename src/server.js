"use strict";

const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const morgan = require("morgan");
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const notFoundHandler = require("./error-handlers/404.js");
const errorHandler = require("./error-handlers/500.js");
const authRoutes = require("./auth/routes.js");
const v1Routes = require("./routes/v1.js");
const v2Routes = require("./routes/v2");

const logger = require("./middleware/logger.js");
app.use(logger);

app.use(authRoutes);
app.use("/api/v1", v1Routes);
app.use("/api/v2", v2Routes);
app.use("*", notFoundHandler);
app.use(errorHandler);

module.exports = {
  server: app,
  start: (port) => {
    if (!port) {
      throw new Error("Missing Port");
    }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};
