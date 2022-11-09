const express = require("express");
const cors = require("cors");
const { products, appEvents } = require("./api");
const ErrorHandler = require("./utils/error/error-handler");
const morganMiddleware = require("./middlewares/morgan");

module.exports = async (app, channel) => {
  app.use(morganMiddleware);
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  app.use(express.static(__dirname + "/public"));

  app.use("/status", (req, res, next) => {
    res.send("Products service running properly");
  });

  // appEvents(app);
  products(app, channel);

  app.use(ErrorHandler);
};
